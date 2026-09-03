import zlib
import struct
import binascii

def make_png(width, height, color_func):
    # PNG signature
    png = b'\x89PNG\r\n\x1a\n'
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = struct.pack('>I', binascii.crc32(b'IHDR' + ihdr_data) & 0xffffffff)
    png += struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc
    
    # IDAT
    raw_lines = []
    for y in range(height):
        line = b'\x00' # Filter type 0
        for x in range(width):
            r, g, b, a = color_func(x, y, width, height)
            line += bytes([r, g, b, a])
        raw_lines.append(line)
    
    compressed = zlib.compress(b''.join(raw_lines))
    idat_crc = struct.pack('>I', binascii.crc32(b'IDAT' + compressed) & 0xffffffff)
    png += struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc
    
    # IEND
    iend_crc = struct.pack('>I', binascii.crc32(b'IEND') & 0xffffffff)
    png += struct.pack('>I', 0) + b'IEND' + iend_crc
    return png

def ominix_icon(x, y, w, h):
    # Normalized coords -1 to 1
    nx = (x / w) * 2 - 1
    ny = (y / h) * 2 - 1
    dist = (nx*nx + ny*ny)**0.5
    
    # Rounded badge background: Indigo / Violet gradient
    if dist < 0.95:
        # Gradient background #4f46e5 to #7c3aed
        t = (ny + 1) / 2
        bg_r = int(79 + (124 - 79) * t)
        bg_g = int(70 + (58 - 70) * t)
        bg_b = int(229 + (237 - 229) * t)
        
        # Center "O" ring for OMINIX
        if 0.35 <= dist <= 0.65:
            # White / cyan glow ring
            return 255, 255, 255, 255
        elif dist < 0.35:
            # Inner dark core
            return 30, 27, 75, 255
        else:
            return bg_r, bg_g, bg_b, 255
    else:
        # Transparent border outside circular badge
        return 0, 0, 0, 0

for size in [16, 32, 64, 80]:
    data = make_png(size, size, ominix_icon)
    path = f"public/assets/icon-{size}.png"
    with open(path, "wb") as f:
        f.write(data)
    print(f"Generated {path} ({len(data)} bytes)")
