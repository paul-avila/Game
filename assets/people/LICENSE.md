# Realistic people: Microsoft Rocketbox avatars

The people in Neon Coast are converted from the **Microsoft Rocketbox Avatar Library**
(https://github.com/microsoft/Microsoft-Rocketbox, commit 0943055), released under the MIT License below.

What was changed for the game:

- FBX models converted to binary glTF (`.glb`) with UVs in glTF orientation; textures resized to 512 px JPEG (1024 px for the player's face) and alpha masks split into `*_opacity_a.jpg`.
- Motion-capture clips (idle, walk, run, sit) baked to `anims.json`, with the root travel removed so the game moves the body.

| Game id | Rocketbox avatar |
|---|---|
| m01 | Male_Adult_01 |
| m05 | Male_Adult_05 |
| m06 | Male_Adult_06 |
| m08 | Male_Adult_08 |
| m09 | Male_Adult_09 |
| m11 | Male_Adult_11 |
| m12 | Male_Adult_12 |
| m16 | Male_Adult_16 |
| m17 | Male_Adult_17 |
| f01 | Female_Adult_01 |
| f03 | Female_Adult_03 |
| f05 | Female_Adult_05 |
| f08 | Female_Adult_08 |
| f12 | Female_Adult_12 |
| f17 | Female_Adult_17 |
| fp2 | Female_Party_02 |
| cop1 | Police_Male_03 |
| cop2 | Police_Male_04 |

```
MIT License

Copyright (c) 2020 Microsoft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
