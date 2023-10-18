#Algoritmo de Luhn

#input do número do cartã ode crédito
card = input('Número: ')

#conversão para inteiro e inversão do tipo
nums = [int(x) for x in card][::-1]

#variavel soma do valor total do algoritmo
sum = 0

#soma os numeros conforme as regras do algoritimo
for i in range(len(nums)):
    if (i % 2 != 0):
        mult = nums[i] * 2
        if (mult > 9):
            splited = [int(a) for a in str(mult)]
            for j in range(len(splited)):
                sum += splited[j]
        else:
            sum += mult
    else:
        sum += nums[i]

#imprime o resultado em relaçã oa validade e bandeira do cartão
if (sum % 10 == 0):
    if ([*card][0] == "3" and ([*card][1] == "4" or [*card][1] == "7")):
        print("AMEX\n")
    if ([*card][0] == "5"):
        if ([*card][1] == "1"):
            print("MASTERCARD\n")
        if ([*card][1] == "2"):
            print("MASTERCARD\n")
        if ([*card][1] == "3"):
            print("MASTERCARD\n")
        if ([*card][1] == "4"):
            print("MASTERCARD\n")
        if ([*card][1] == "5"):
            print("MASTERCARD\n")
    if ([*card][0] == "4"):
        print("VISA\n")
else:
    print("INVÁLIDO\n")
