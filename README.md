# Syntra × ZARA · AR ticket (Man Gold)

Scan the ticket QR → page opens in the phone browser → point the camera at the drawing →
the bottle rises out of the paper, the nine ingredients orbit it in three rings (top / heart / base),
and a sheet at the bottom explains each one. Drag to spin, walk around it to see it from every side.
No app to install. Works in Safari (iPhone) and Chrome (Android).

## Files
- `index.html` – the whole experience (MindAR image tracking + three.js) and the pop-out animation. Scent data is the `SCENT` block at the top of the script.
- `bottle.js` – the ZARA Man Gold bottle (proportions from the product photo, gold Montserrat lettering).
- `ingredients.js` – the nine 3D ingredients. To use a real scanned model instead, put a `.glb` in `assets/models/` and add its path as the 4th item of that note in `SCENT`.
- `fx.js` – gold sparkles and the shock ring.
- `assets/target.png` – the drawing the camera looks for. **Interim copy cut from the ticket screenshot.** Replace it with the original drawing file exactly as printed (square, at least 1000 px, with the thick outer frame).
- `assets/targets.mind` – the tracking file made from `target.png`. Re-make it every time `target.png` changes (step 2).
- `compile.html`, `serve.py` – local tools for testing and for making `targets.mind`.

## 1. Test on your computer
```
cd syntra-ar
python3 serve.py
```
Open http://localhost:8765/index.html?preview for the 3D view (no camera needed), or `?lab` to see all nine ingredients side by side.
`http://localhost:8765/index.html` opens the camera on a computer; point a webcam at the drawing on screen or on paper.

## 2. Make the tracking file (once per drawing)
With `serve.py` running, open http://localhost:8765/compile.html and press **Compile**. It saves `assets/targets.mind`.
(Alternative: the online tool at https://hiukim.github.io/mind-ar-js-doc/tools/compile, upload `target.png`, download the `.mind` file and rename it `targets.mind`.)

## 3. Put it online (needs https, phones refuse the camera on plain http)
Upload the whole `syntra-ar` folder to any static host, for example:
- Netlify: drag the folder onto https://app.netlify.com/drop
- GitHub Pages or Vercel: push the folder to a repo and enable Pages / import it.
You get an address like `https://something.netlify.app/`. Open it on a phone and test with the drawing on a screen.

## 4. Make the QR and print
Make a QR code that points to that address (any QR generator, high error-correction, quiet zone kept),
put it on the ticket in place of the old one, and print. Print the drawing at least 4 cm wide, matte paper, no glare,
and keep the lines dark. Test with the printed copy before you print the final ticket.

## Notes
- Tracking needs good light and the whole drawing in view. If it struggles, hold the phone a little farther back.
- Instagram / WhatsApp in-app browsers can block the camera. If the QR opens inside one, tap "Open in Safari / Chrome".
- The three.js and MindAR libraries load from the jsDelivr CDN, so the phone needs internet.
- To make another scent: change `SCENT` in `index.html`, make a new drawing, compile it, and publish a separate copy.
