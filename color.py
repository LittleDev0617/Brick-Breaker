from PIL import Image
import numpy as np
import glob

blocks = glob.glob('./assets/blocks/*/*.png')
colors = {}
for block in blocks:
    if 'destroy' in block:
        continue

    img = Image.open(block).convert("RGBA")
    arr = np.array(img)

    mask = arr[..., 3] > 0
    rgb = arr[mask][:, :3]
    r, g, b = rgb.mean(axis=0)
    print(f'{block.split("\\")[-1]}: #{round(r):02X}{round(g):02X}{round(b):02X}')