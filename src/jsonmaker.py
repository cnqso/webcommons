import json
import collections
import random
from perlin_noise import PerlinNoise



width = 40
height = 40


noise = PerlinNoise(octaves=10, seed=3)
pic = [[noise([i/width, j/height] ) + 0.3 for j in range(width)] for i in range(height)]
flatPic = sum(pic, [])
print(len(flatPic))
print(min(flatPic))
print(sum(flatPic)/12000)





# mapTiles = []
# for i in range(height):
#     row = []
#     for j in range(width):
#         tile = collections.OrderedDict()
#         tile['key'] = i*width+j
#         tile['type'] = "empty"
#         tile['buildingId'] = 0
#         if pic[i][j] > random.random():
#             tile['spriteIndex'] = random.randint(12,15)
#         else:
#             tile['spriteIndex'] = 0
#         row.append(tile)
#     mapTiles.append(row)

# # mapTiles = []
# # for i in range(height):
# #     row = []
# #     for j in range(width):
# #         row.append("#000000")
# #     mapTiles.append(row)

# mapJson = json.dumps(mapTiles, indent=2)

# with open('map.json', 'w') as file:
#     file.truncate(0)
#     file.write(mapJson)


    
mapTiles = []
for i in range(height):
    row = []
    for j in range(width):
        if pic[i][j] > random.random():
            row.append(random.randint(12,15))
        else:
            row.append(0)
    mapTiles.append(row)

rawTiles = []
for row in mapTiles:
    for item in row:
        rawTiles.append(item)

# mapTiles = []
# for i in range(height):
#     row = []
#     for j in range(width):
#         row.append("#000000")
#     mapTiles.append(row)

mapJson = json.dumps(rawTiles, indent=2)

with open('rawTiles.json', 'w') as file:
    file.truncate(0)
    file.write(mapJson)