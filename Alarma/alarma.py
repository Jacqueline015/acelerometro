from machine import Pin
from machine import I2C
import time
import ustruct

DATA_FORMAT         = 0x31
BW_RATE             = 0x2c
POWER_CTL           = 0x2d
INT_ENABLE          = 0x2E

BW_RATE_1600HZ      = 0x0F
BW_RATE_800HZ       = 0x0E
BW_RATE_400HZ       = 0x0D
BW_RATE_200HZ       = 0x0C
BW_RATE_100HZ       = 0x0B
BW_RATE_50HZ        = 0x0A
BW_RATE_25HZ        = 0x09

RANGE_2G            = 0x00
RANGE_4G            = 0x01
RANGE_8G            = 0x02
RANGE_16G           = 0x03

OFSX = 0x1e
OFSY =0x1f
OFSZ =0x20

class adxl345:
    def __init__(self, scl, sda):
        self.scl = scl
        self.sda = sda
        self.i2c = I2C(0,scl = self.scl, sda = self.sda, freq = 100000)
        slv = self.i2c.scan()
        for s in slv:
            buf = self.i2c.readfrom_mem(s, 0, 1)
            if(buf[0] == 0xe5):
                self.slvAddr = s
                print('adxl345 found')
            break
        #self.writeByte(POWER_CTL,0x00)  #sleep
        #time.sleep(0.001)
        self.writeByte(DATA_FORMAT,0x2B)
        self.writeByte(BW_RATE,0x0A)
        self.writeByte(INT_ENABLE,0x00)

        self.writeByte(OFSX,0x00)
        self.writeByte(OFSY,0x00)
        self.writeByte(OFSZ,0x00)

        self.writeByte(POWER_CTL,0x28)
        time.sleep(1)

    def readXYZ(self):
        fmt = '<h' #little-endian
        buf1 = self.readByte(0x32)
        buf2 = self.readByte(0x33)
        buf = bytearray([buf1[0], buf2[0]])
        x, = ustruct.unpack(fmt, buf)
        x = x*3.9

        buf1 = self.readByte(0x34)
        buf2 = self.readByte(0x35)
        buf = bytearray([buf1[0], buf2[0]])
        y, = ustruct.unpack(fmt, buf)
        y = y*3.9

        buf1 = self.readByte(0x36)
        buf2 = self.readByte(0x37)
        buf = bytearray([buf1[0], buf2[0]])
        z, = ustruct.unpack(fmt, buf)
        z = z*3.9
        return (x,y,z)

    def writeByte(self, addr, data):
        d = bytearray([data])
        self.i2c.writeto_mem(self.slvAddr, addr, d)

    def readByte(self, addr):
        return self.i2c.readfrom_mem(self.slvAddr, addr, 1)



    
#Se define pin 17 para scl, pin 16 para sda del acelerometro
#Se define pin 13 como pin de salida para la Alarma (buzzer)
scl = Pin(17)
sda = Pin(16)
snsr = adxl345(scl, sda)

Alarma = Pin(13, Pin.OUT)
#Se mantiene el LED encendido como inicio
Alarma.off()

#Se crea una variable button y se configura en el Pin14
#como una entrada y con resistencia de Pull Down
button = Pin(14, Pin.IN, Pin.PULL_DOWN)
last_state = False
current_state = False

#Se define una variable entera "valores" para sabar el promedio de
#10 valores
valores = 10
#se inicializan los valores para la suma acumulada de los 10 valores 
sumax = 0.0
sumay = 0.0
sumaz = 0.0 


#Se crea un contador inicial para calcular los promedios anteriores
for i in range(10):
        x,y,z = snsr.readXYZ()
         
        sumax += x
        sumay += y
        sumaz += z
        time.sleep(0.1)
#Se calculan los promedios anteriores para cada eje 
promedioxa = sumax / valores
promedioya = sumay /valores
promedioza = sumaz / valores

#Empieza el ciclo indefinido y se inicializan las variables de suma
#una vez que termine el bucle vuelve a iniciar con las variables de suma
#en cero de nuevo y así de forma infinita
while True:
    sumax = 0.0
    sumay = 0.0
    sumaz = 0.0
    
    #Se crea un contador para calcular los promedios actuales
    for i in range(10):
        x,y,z = snsr.readXYZ()
         
        sumax += x
        sumay += y
        sumaz += z
        time.sleep(0.1)
    #Se calculan los promedios actuales
    promediox = sumax / valores
    promedioy = sumay /valores
    promedioz = sumaz / valores
    #Se toman las diferencias de promedio en cada eje
    diferenciax = promediox - promedioxa
    diferenciay = promedioy - promedioya
    diferenciaz = promedioz - promedioza
    
    #Se crea una condición para activar la alarma en base a la
    #diferencia de promedios y considerando un valor absoluto 
    if abs(diferenciaz) >= 180 or abs(diferenciay) >=30 or abs(diferenciax) >=15:
        #Se activa el LED o alarma
        Alarma.on()
        
    #Se iguala el promedio anterior para irlo actualizando 
    promedioxa = promediox
    promedioya = promedioy
    promedioza = promedioz
    
    #print("promedio actual")
    print('x:',promediox,'y:',promedioy,'z:',promedioz)
    
    #print("promedio anterior")
    #print('x:',promedioxa,'y:',promedioya,'z:',promedioza)
    
    #print('x:',x,'y:',y,'z:',z,'uint:mg')
    #print ("diferencia z:")
    #print(diferenciaz)
    #print ("diferencia y:")
    #print(diferenciay)
    #print ("diferencia x:")
    #print(diferenciax)
    current_state = button.value()
    if last_state == 1 and current_state == 0:
        Alarma.off()
    
    last_state = current_state
    

    