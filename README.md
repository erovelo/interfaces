# Interfaces BCI
BCI desarrolladas para proyecto terminal UAM-C

En este repositorio encontraras tres carpetas donde cada es una interfaces diferentes:

# 1. adquisición (probado en ubuntu 18.04 lts)
NOTA: La interfaz gráfica solo funciona para datos sinteticos (simulador), si se usa con la tarjeta Cyton se congela la ventana y se queda en blanco. Usar solo el modo Consola para leer desde la tarjeta Cyton física.

En está carpeta se encuentra dos programas que adquieren datos simulados o reales de la tarjeta Cyton de OpenBCI:
  - Grafica. Muestra una ventana con los datos que se están obteniendo, y se van almacenando en un archivo de texto.
  - Consola. Almacena los datos en un archivo.

Para instalarlos, es necesario tener instalado:
  - nodejs 10.x
  - npm (se instala con nodejs)

Para instalarlo se usan los siguientes comandos. El primer comando es para ubicarnos dentro de la carpeta adquisicion y el segundo instala las depedencias (carpeta node_modules):
  cd adquisicion
  npm install

Para iniciar el modo Grafica, se usa el siguiente comando:
  npm run start

Para iniciar el modo Consola, se usa el siguiente comando:
  npm run console




# 2. Matriz de estimulación General (probado en ubuntu 18.04)
En está carpeta se encuentran el programa que muestra la matriz de estimulación general para instalarlos es necesario:
  - nodejs 10.x
  - npm (se instala con nodejs)
  
Para instalarlo se usan los siguientes comandos. El primer comando es para ubicarnos dentro de la carpeta general y el segundo instala las depedencias (carpeta node_modules):
  cd general
  npm install
  
Para iniciar se usa el siguiente comando:
  npm run start

# 3. Matriz de estimulación Dinámica (probado en ubuntu 18.04)
NOTA 1: Es posible que no se pueda correr OpenCV si tiene instalado Anaconda, esto se debe a un problema de referencias. Para este caso aún no se ha encontrado una solución.

NOTA 2: Durante el ciclo del programa puede que se congele en la palabra "Espere...". Esto es porque las imagenes alojadas en la carpeta base de datos son demasiadas pesadas. En este caso hay que comprimir las imagenes los más que se puede sin perder tanta calidad. Entre más imagenes haya, más se va a tardar en analizar todas las imagenes.

En está carpeta se encuentran el programa que muestra la matriz de estimulación general para instalarlos es necesario:
  - OpenCV 3.4.4
  - Python 3
 
Para instalar OpenCV es necesario leer antes la siguiente pagina de instalación. Ya que es un proceso largo y es la unica manera de instalar las librerias de SIFT que son las que utilizamos:
  https://www.pyimagesearch.com/2018/05/28/ubuntu-18-04-how-to-install-opencv/
  
Para usarlo es usar lo siguiente
  cd dinamica
  python3 deteccion.py scene.jpg
