from cryptography.fernet import Fernet

# Replace with the actual key (if you have it)
key = b"Y29zbW9zPQ=="  
ciphertext = "gAAAAABlxAbc36lTjUBp7RdLdsowYQMbvrMtiRRdWpj9u4QeK7JzR_kvtEAXZ6vQAkJe4Ej3E5uXT2N2Q9NLKDh_GuH9aF-DVA=="

fernet = Fernet(key)
plaintext = fernet.decrypt(ciphertext.encode())
print(plaintext.decode())