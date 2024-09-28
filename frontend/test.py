from base58 import b58encode
import base64

# 将字节数组粘贴到这里
bytes_array = [103,183,158,61,166,98,148,240,149,60,239,10,3,36,74,237,91,41,77,247,125,213,157,222,43,214,122,180,3,238,1,76,160,30,104,65,124,169,91,152,50,225,66,43,207,167,44,109,29,215,65,54,120,140,242,243,139,234,131,122,88,199,206,47]

secret_key = bytes(bytes_array)
public_key = base64.b64encode(bytes(secret_key[:32])).decode()

# print(f"Public Key: {public_key}")
print(f"Private Key: {b58encode(secret_key).decode()}")