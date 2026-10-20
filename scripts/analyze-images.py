import os
import colorsys
from PIL import Image

COLOR_TABLE = [
    ((41, 60, 80), 'Navy Blue'),
    ((70, 95, 125), 'Slate Blue'),
    ((85, 105, 75), 'Olive Sage'),
    ((115, 148, 101), 'Meadow Green'),
    ((180, 85, 90), 'Rose Crimson'),
    ((150, 60, 65), 'Rustic Wine'),
    ((99, 89, 87), 'Charcoal Taupe'),
    ((177, 137, 86), 'Mustard Ochre'),
    ((163, 119, 128), 'Dusty Rose'),
    ((145, 89, 97), 'Plum Berry'),
    ((119, 119, 118), 'Heather Grey'),
    ((76, 85, 108), 'Midnight Navy'),
    ((72, 128, 80), 'Forest Green'),
    ((77, 77, 76), 'Graphite Black'),
    ((147, 72, 80), 'Deep Maroon'),
    ((127, 72, 54), 'Terracotta Rust'),
    ((82, 58, 44), 'Espresso Brown'),
    ((129, 101, 93), 'Cocoa Walnut'),
    ((143, 156, 176), 'Steel Blue'),
    ((178, 126, 131), 'Blush Pink'),
    ((192, 150, 142), 'Warm Sand'),
    ((127, 125, 136), 'Lavender Mist'),
    ((56, 45, 51), 'Deep Cocoa'),
    ((42, 46, 38), 'Dark Moss'),
    ((118, 82, 86), 'Mulberry Wine'),
    ((17, 40, 43), 'Teal Spruce'),
]

def closest_name(rgb):
    min_dist = float('inf')
    best = 'Variant'
    for c_rgb, name in COLOR_TABLE:
        dist = sum((a - b) ** 2 for a, b in zip(rgb, c_rgb))
        if dist < min_dist:
            min_dist = dist
            best = name
    return best

def analyze(image_path):
    with Image.open(image_path) as img:
        img = img.convert('RGB')
        w, h = img.size
        crop = img.crop((int(w * 0.15), int(h * 0.15), int(w * 0.85), int(h * 0.85)))
        crop = crop.resize((80, 80))
        pixels = list(crop.getdata())
        
        # Calculate saturation
        filtered = []
        for r, g, b in pixels:
            h_v, s_v, v_v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            filtered.append((r, g, b, h_v, s_v, v_v))
            
        # Top saturated pixels (represent the colored stripes/checks rather than cream background)
        sorted_by_sat = sorted(filtered, key=lambda x: x[4], reverse=True)
        top_sat = sorted_by_sat[:int(len(sorted_by_sat) * 0.25)]
        sat_r = int(sum(p[0] for p in top_sat) / len(top_sat))
        sat_g = int(sum(p[1] for p in top_sat) / len(top_sat))
        sat_b = int(sum(p[2] for p in top_sat) / len(top_sat))
        
        hex_code = f"#{sat_r:02x}{sat_g:02x}{sat_b:02x}"
        cname = closest_name((sat_r, sat_g, sat_b))
        return hex_code, cname, (sat_r, sat_g, sat_b)

def main():
    root = 'image'
    products_data = []
    for prod in sorted(os.listdir(root)):
        pdir = os.path.join(root, prod)
        if not os.path.isdir(pdir):
            continue
        print(f"\n{prod}:")
        variants = []
        for f in sorted(os.listdir(pdir)):
            fp = os.path.join(pdir, f)
            hex_c, name, rgb = analyze(fp)
            print(f"  {f} -> Hex: {hex_c}, Color: {name}, RGB: {rgb}")
            variants.append({'file': f, 'hex': hex_c, 'name': name})
        products_data.append({'product': prod, 'variants': variants})

if __name__ == '__main__':
    main()
