#!/usr/bin/env python3

# ATENÇÃO: NENHUM IMPORT ADICIONAL É PERMITIDO!
import sys
import math
import base64
import tkinter
from io import BytesIO
from turtle import clear
from PIL import Image as PILImage


class Imagem:
    def __init__(self, largura, altura, pixels):
        self.largura = largura
        self.altura = altura
        self.pixels = pixels

    def apply_kernel(self):
        img = []
        novo = []
        count = 0
        for i in range(len(self.pixels)):
            novo.append(self.pixels[i])
            count += 1
            if count == self.largura:
                img.append(novo)
                count = 0
                novo = []
        return

    def get_pixel(self, x, y):
        pixel = y * self.largura + x
        return self.pixels[pixel]

    def set_pixel(self, x, y, c):
        pixel = y * self.largura + x
        self.pixels[pixel] = c

    def aplicar_por_pixel(self, func):
        resultado = Imagem.new(self.largura, self.altura)
        for x in range(resultado.largura):
            for y in range(resultado.altura):
                cor = self.get_pixel(x, y)
                nova_cor = func(cor)
                resultado.set_pixel(x, y, nova_cor)
        return resultado

    def invertido(self):
        return self.aplicar_por_pixel(lambda c: 255 - c)

    def borrado(self, n):
        raise NotImplementedError

    def focado(self, n):
        raise NotImplementedError

    def bordas(self):
        raise NotImplementedError

    # Abaixo deste ponto estão utilitários para carregar, salvar,
    # mostrar e testar imagens.

    def __eq__(self, other):
        return all(getattr(self, i) == getattr(other, i)
                   for i in ('altura', 'largura', 'pixels'))

    def __repr__(self):
        return "Imagem(%s, %s, %s)" % (self.largura, self.altura, self.pixels)

    @classmethod
    def carregar(cls, arquivo):
        """
        Carrega uma imagem a partir de um arquivo e retorna uma instância
        da classe representando essa imagem. Também realiza a conversão
        para escala de cinza.

        Modo de usar:
           i = Imagem.carregar('imagens_teste/gato.png')
        """
        with open(arquivo, 'rb') as img_handle:
            img = PILImage.open(img_handle)
            img_data = img.getdata()
            if img.mode.startswith('RGB'):
                pixels = [round(.299 * p[0] + .587 * p[1] + .114 * p[2])
                          for p in img_data]
            elif img.mode == 'LA':
                pixels = [p[0] for p in img_data]
            elif img.mode == 'L':
                pixels = list(img_data)
            else:
                raise ValueError('Modo de imagem não suportado: %r' % img.mode)
            w, h = img.size
            return cls(w, h, pixels)

    @classmethod
    def new(cls, largura, altura):
        """
        Cria uma nova imagem em branco (tudo 0) para uma dada largura e altura.

        Modo de uso:
            i = Imagem.new(640, 480)
        """
        return cls(largura, altura, [0 for i in range(largura * altura)])

    def salvar(self, arquivo, modo='PNG'):
        """
        Salva uma dada imagem no disco ou para um objeto semelhante a um
        arquivo. Se "arquivo" é dado como uma string, o tipo de arquivo
        será inferido do próprio nome. Se "arquivo" for dado como um
        objeto semelhante a um arquivo, o tipo de arquivo será determinaddo
        pelo parâmetro "modo".
        """
        out = PILImage.new(mode='L', size=(self.largura, self.altura))
        out.putdata(self.pixels)
        if isinstance(arquivo, str):
            out.save(arquivo)
        else:
            out.save(arquivo, modo)
        out.close()

    def gif_data(self):
        """
        Retorna uma string codificada em base 64, contendo
        a imagem como um GIF. É um utilitário para fazer a função
        mostrar ficar mais limpa.
        """
        buff = BytesIO()
        self.salvar(buff, modo='GIF')
        return base64.b64encode(buff.getvalue())

    def mostrar(self):
        """
        Mostra a imagem em uma janela Tk.
        """
        global WINDOWS_OPENED
        if tk_root is None:
            # Se o Tk não está inicializado de forma apropriada, não faz nada.
            return
        WINDOWS_OPENED = True
        toplevel = tkinter.Toplevel()
        # highlightthickness=0 é um hack para evitar que o redimensionamento da janela
        # dispare outro evendo de redimensionamento (causando um loop infinito). Veja
        # https://stackoverflow.com/questions/22838255/tkinter-canvas-resizing-automatically
        canvas = tkinter.Canvas(toplevel, altura=self.altura,
                                largura=self.largura, highlightthickness=0)
        canvas.pack()
        canvas.img = tkinter.PhotoImage(data=self.gif_data())
        canvas.create_image(0, 0, image=canvas.img, anchor=tkinter.NW)

        def on_resize(event):
            # Realiza o redimensionamento da imagem quando a janela é redimensionada.
            # O procedimento é:
            #  * Converter para uma imagem PIL
            #  * Redimensionar essa imagem
            #  * Obter o GIF codificado em base64 a partir da imagem redimensionada
            #  * Colocar essa imagem em um label tkinter
            #  * Mostrar essa imagem no canvas
            new_img = PILImage.new(mode='L', size=(self.largura, self.altura))
            new_img.putdata(self.pixels)
            new_img = new_img.resize(
                (event.largura, event.altura), PILImage.NEAREST)
            buff = BytesIO()
            new_img.save(buff, 'GIF')
            canvas.img = tkinter.PhotoImage(
                data=base64.b64encode(buff.getvalue()))
            canvas.configure(height=event.altura, width=event.largura)
            canvas.create_image(0, 0, image=canvas.img, anchor=tkinter.NW)

        # Finalmente, vincular essa função para que ela seja chamada
        # quando a janela for redimensionada.
        canvas.bind('<Configure>', on_resize)
        toplevel.bind('<Configure>', lambda e: canvas.configure(
            height=e.altura, width=e.largura))

        # when the window is closed, the program should stop
        toplevel.protocol('WM_DELETE_WINDOW', tk_root.destroy)


try:
    tk_root = tkinter.Tk()
    tk_root.withdraw()
    tcl = tkinter.Tcl()

    def reafter():
        tcl.after(500, reafter)

    tcl.after(500, reafter)
except:
    tk_root = None
WINDOWS_OPENED = False

if __name__ == '__main__':
    # O código neste bloco somente será rodado quando você, explicitamente,
    #  rodar seu script, e não quando os testes forem executados. Este é um
    #  bom lugar para gerar imagens, etc.

    # inicio

    # QUESTÃO 1
    #esperado = pset2.Imagem(4, 1, [226, 166, 119, 55])
    # basta subtrair o valor do index de 255, que é o limite para o valor de cor
    #ex: 255 - 29 = 226

    # QUESTÃO 2
    peixe_img = Imagem.carregar('imagens_teste/peixe.png')
    peixe_resultado = peixe_img.invertido()
    peixe_resultado.salvar('resultados_teste/peixe_invertido.png')

    # QUESTÃO 3
    print("QUESTÃO 3: ",
          (0.00 * 80) +
          (-0.07 * 53) +
          (0.00 * 99) +
          (-0.45 * 129) +
          (1.20 * 127) +
          (-0.25 * 148) +
          (0.00 * 175) +
          (-0.12 * 174) +
          (0.00 * 193)
          )
    #resposta: 32.76

    imagem = Imagem(4, 1, [29, 89, 136, 200])
    imagem.apply_kernel()

    pass

    # O código a seguir fará com que as janelas em Imagem.show
    # sejam mostradas de modo apropriado, se estivermos rodando
    # interativamente ou não:
    if WINDOWS_OPENED and not sys.flags.interactive:
        tk_root.mainloop()
