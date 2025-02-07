import random
import string

characters=string.whitespace+string.punctuation+string.digits+string.ascii_letters
characters=list(characters)
key=characters.copy()
random.shuffle(key)

# print(f"characters={characters}")
# print(f"key: {key}")

#Encrypt
plain_text=input("Enter the message to encrypt: ")
cipher_text=""

for letter in plain_text:
    index=characters.index(letter)
    cipher_text=cipher_text+key[index]
print(f"Original message:{plain_text}")
print(f"Encrypted message: {cipher_text}")


#Decrypt
cipher_text=input("Enter the message to decrypt: ")
plain_text=""

for letter in cipher_text:
    index=key.index(letter)
    plain_text=plain_text+characters[index]
print(f"Encrypted message:{plain_text}")
print(f"Decrypted message: {cipher_text}")
    