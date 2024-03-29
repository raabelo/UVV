#!/usr/bin/env python3

from email.mime import image
import os
import pset2
import unittest

TEST_DIRECTORY = os.path.dirname(__file__)


class TestImagem(unittest.TestCase):
    def test_carregar(self):
        resultado = pset2.Imagem.carregar(
            'imagens_teste/pixel_centralizado.png')
        esperado = pset2.Imagem(11, 11,
                                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 255, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertEqual(resultado, esperado)


class TestInvertido(unittest.TestCase):
    def test_invertido_1(self):
        imagem = pset2.Imagem.carregar('imagens_teste/pixel_centralizado.png')
        resultado = imagem.invertido()
        esperado = pset2.Imagem(11, 11,
                                [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 0, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
                                 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])
        self.assertEqual(resultado, esperado)

    def test_invertido_2(self):
        # ESCREVA AQUI o código de seu caso de teste, de acordo com a
        # Seção 3.1 do PSET:
        imagem = pset2.Imagem(4, 1, [29, 89, 136, 200])
        resultado = imagem.invertido()
        esperado = pset2.Imagem(4, 1, [226, 166, 119, 55])
        self.assertEqual(resultado, esperado)

    def test_imagens_invertidas(self):
        for arquivo in ('cogumelo', 'gatos', 'xadrez'):
            with self.subTest(f=arquivo):
                entrada = os.path.join(
                    TEST_DIRECTORY, 'imagens_teste', '%s.png' % arquivo)
                saida = os.path.join(
                    TEST_DIRECTORY, 'resultados_teste', '%s_invertido.png' % arquivo)
                resultado = pset2.Imagem.carregar(entrada).invertido()
                esperado = pset2.Imagem.carregar(saida)
                self.assertEqual(resultado, esperado)


class TestFilters(unittest.TestCase):
    def test_borrado(self):
        for kernsize in (1, 3, 7):
            for arquivo in ('cogumelo', 'gatos', 'xadrez'):
                with self.subTest(k=kernsize, f=arquivo):
                    entrada = os.path.join(
                        TEST_DIRECTORY, 'imagens_teste', '%s.png' % arquivo)
                    saida = os.path.join(TEST_DIRECTORY, 'resultados_teste',
                                         '%s_blur_%02d.png' % (arquivo, kernsize))
                    input_img = pset2.Imagem.carregar(entrada)
                    input_img_copy = pset2.Imagem(
                        input_img.width, input_img.height, input_img.pixels)
                    resultado = input_img.blurred(kernsize)
                    esperado = pset2.Imagem.carregar(saida)
                    self.assertEqual(input_img, input_img_copy,
                                     "Cuidado para não modificar a imagem original!")
                    self.assertEqual(resultado, esperado)

    def test_focado(self):
        for kernsize in (1, 3, 9):
            for arquivo in ('cogumelo', 'gatos', 'xadrez'):
                with self.subTest(k=kernsize, f=arquivo):
                    entrada = os.path.join(
                        TEST_DIRECTORY, 'imagens_teste', '%s.png' % arquivo)
                    saida = os.path.join(TEST_DIRECTORY, 'resultados_teste',
                                         '%s_sharp_%02d.png' % (arquivo, kernsize))
                    input_img = pset2.Imagem.carregar(entrada)
                    input_img_copy = pset2.Imagem(
                        input_img.width, input_img.height, input_img.pixels)
                    resultado = input_img.sharpened(kernsize)
                    esperado = pset2.Imagem.carregar(saida)
                    self.assertEqual(input_img, input_img_copy,
                                     "Cuidado para não modificar a imagem original!")
                    self.assertEqual(resultado, esperado)

    def test_bordas(self):
        for arquivo in ('cogumelo', 'gatos', 'xadrez'):
            with self.subTest(f=arquivo):
                entrada = os.path.join(
                    TEST_DIRECTORY, 'imagens_teste', '%s.png' % arquivo)
                saida = os.path.join(
                    TEST_DIRECTORY, 'resultados_teste', '%s_edges.png' % arquivo)
                input_img = pset2.Imagem.carregar(entrada)
                input_img_copy = pset2.Imagem(
                    input_img.width, input_img.height, input_img.pixels)
                resultado = input_img.edges()
                esperado = lab.Image.load(saida)
                self.assertEqual(input_img, input_img_copy,
                                 "Cuidado para não modificar a imagem original!")
                self.assertEqual(resultado, esperado)


if __name__ == '__main__':
    res = unittest.main(verbosity=3, exit=False)
