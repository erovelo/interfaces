import os
import cv2
import numpy as np
import time
import sys


# Train = objeto
# Query = objeto en escena

class ObjRecognition(object):
    def flannBasedMatcher(self, dcTrain, dcQuery):
        FLANN_INDEX_KDITREE = 0
        flannParam = dict(algorithm=FLANN_INDEX_KDITREE, tree=5)
        flann = cv2.FlannBasedMatcher(flannParam, {})

        matches = flann.knnMatch(dcQuery, dcTrain, k = 2)
        return matches
    def filtrandoMatches(self, matches):
        good = []
        for m,n in matches:
            if(m.distance < (0.75 * n.distance)):
                good.append(m)
        return good

    # img1 = objeto
    # img2 = donde buscar el objeto
    # Coincide un objeto (img1) dentro de la escena (img2)
    def match(self, imgObjGray, imgSceneGray, imgScene):
        sift = cv2.xfeatures2d.SIFT_create()

        kp1, dc1 = sift.detectAndCompute(imgObjGray, None)
        kp2, dc2 = sift.detectAndCompute(imgSceneGray, None)

        matches = self.flannBasedMatcher(dc1, dc2)
        goodMatch = self.filtrandoMatches(matches)

        MIN_MATCH_COUNT = 40
        matchCount = len(goodMatch)
        res = 0
        if (matchCount >= MIN_MATCH_COUNT):
            #print matchCount
            tp = []
            qp = []

            for m in goodMatch:
                tp.append(kp1[m.trainIdx].pt)
                qp.append(kp2[m.queryIdx].pt)

            tp, qp = np.float32((tp, qp))

            H, status = cv2.findHomography(tp, qp, cv2.RANSAC, 3.0)

            # dimensiones del objeto
            h, w = imgObjGray.shape
            trainBorder = np.float32([[[0, 0], [0, h - 1], [w - 1, h - 1], [w - 1, 0]]])
            queryBorder = cv2.perspectiveTransform(trainBorder, H)

            # Dibujando lineas en escena
            cv2.polylines(imgScene, [np.int32(queryBorder)], True, (0, 255, 0), 5)
            res = 1

        else:
            #print "No hay suficientes coincidencias - %d,%d" % (matchCount, MIN_MATCH_COUNT)
            res = 0

        return res, imgScene

    def matchTwoImagenes(self, img1URL, img2URL):
        img1 = cv2.imread(img1URL,0)
        img2 = cv2.imread(img2URL)
        imgGray = cv2.imread(img2URL,0)

        cv2.imshow("red", img2)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

        cv2.namedWindow("Resultado", cv2.WINDOW_NORMAL)
        cv2.resizeWindow("Resultado", 600, 400)

        res, img = self.match(img1, imgGray, img2)

        #if(res == 1):
            #cv2.imshow("Resultado", img)
            #cv2.waitKey(0)
            #cv2.destroyAllWindows()
        return res, img

    def matchImgToBD(self, rutaBD, imgSceneURL):
        objNames = os.listdir(rutaBD)  # Lista de nombre de objetos

        imgs = {}
        for obj in objNames:
            imgFiles = os.listdir(rutaBD + "/" + obj)
            imgs[obj] = imgFiles

        objReconocidos = {}

        print("Espere...")
        for obj in imgs:
            #print "Comparando imagen con el objeto " + obj
            for img in imgs[obj]:
                #print img
                res, imgRes = self.matchTwoImagenes(rutaBD+"/"+obj+"/"+img, imgSceneURL)
                if(res == 1):
                    if(obj not in objReconocidos):
                        objReconocidos[obj] = imgRes
        return objReconocidos



    def pruebaCamara(self, imgURL):

        # Obteniendo imagen del objeto
        img = cv2.imread(imgURL, 0)

        # Iniciando camara de video
        cap = cv2.VideoCapture(0)

        cv2.namedWindow("Resultado", cv2.WINDOW_NORMAL)
        cv2.resizeWindow("Resultado", 600, 400)

	# Inicia la captura de video
        while (cap.isOpened()):
            # Captura frame por frame
            ret, frame = cap.read()

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            res = self.match(img, gray, frame)

            cv2.imshow("Resultado", res)

            # Si se apreta un boton salir del while
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()




if(len(sys.argv)< 2):
	print("usage: python deteccion.py scene.jpg")
	exit(0)

obr = ObjRecognition()
#obr.pruebaCamara('coca.jpg')
#obr.matchTwoImagenes("coca.jpg", "img2.jpg")

sceneimg = sys.argv[1]

testImg = cv2.imread(sceneimg)
if testImg is None:
    sys.exit("Cout not read the image")

objsReconocidos = obr.matchImgToBD("basedatos/", sceneimg)

c = len(objsReconocidos)

if(c > 0):
    print("Se reconocieron %d objetos: " % (c))
    for objName in objsReconocidos:
        print (" %s" % (objName))

    r = input("Iniciar estimulacion? [Y,n]: ")

    if(r != "n"):
        cv2.resizeWindow("Resultado", 600, 400)
        cv2.namedWindow("Resultado", cv2.WINDOW_NORMAL)
        f = True

        while(f):
            for objName in objsReconocidos:
                cv2.imshow("Resultado", objsReconocidos[objName])
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    f = False
                time.sleep(.3)



        cv2.destroyAllWindows()
    else:
        print("Abortado")

else:
    print("No se reconocio ningun objeto")
