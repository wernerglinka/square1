# SVG Illustrations and Icon files

I use Sketch to create Icon/Illustrations. These graphics will then be exported as svg code which can be used inline or as a svg img.

To make an svg file follow these steps:

- Use an artboard of 500px x 500px
- Center the illustration in the artboard
- Give the Page a unique name - this name will be used as the svg tag ID in the SVG code
- Give the Artboard a unique name
- Give all graphic elements a unique name
- Select the artboard and copy the code. In the main nav Edit > Copy > Copy SVG Code
- Paste this code into the code file

An example would look like this:


<svg width="500px" height="500px" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="shield" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="shield-container" fill-rule="nonzero">
            <path d="M249.300076,45.0082791 C217.54955,44.7056618 169.281728,54.8871237 104.496611,71.1763918 L104.496611,224.930358 C104.496611,330.833378 154.884968,407.523259 253.351584,455 C348.489385,407.523259 397,329.112853 397,223.209832 L397,68.9882554 C329.980914,52.6989873 282.145448,44.7056618 249.300076,45.0082791 Z M104.496611,71.1763918 L104.496611,224.930358" id="shield-border" stroke="#000000" stroke-width="5" stroke-linejoin="round"></path>
            <path d="M255.014881,446 C290.588483,427.696371 318.506668,406.225332 338.101074,382.52648 C387.401333,322.899283 391.998938,257.894353 391.998938,257.894353 C391.998938,257.894353 391.999047,239.288165 391.999265,202.075789 C391.999382,182.184504 391.999627,140.385937 392,76.680085 L363.984057,70 C363.983683,130.859574 363.9845,177.177996 363.984384,196.180569 C363.984166,231.730354 363.984057,249.505247 363.984057,249.505247 C363.984057,249.505247 352.078114,367.725721 227,429.206627 L255.014881,446 Z" id="shield-shadow" fill="#D8D8D8"></path>
            <polyline id="shield-checkmark" stroke="#DF3434" stroke-width="5" points="212 228.953722 250.199906 262 311 190"></polyline>
        </g>
    </g>
</svg>

- To make this svg responsive we'll delete the width and height attributes in the svg tag
- To avoid having duplicate IDs in the future when using the same svg multiple times on a page we convert all unique IDs into classes by replacing all _id="_ with _class="_

This will result into:

<svg viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g class="shield" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g class="shield-container" fill-rule="nonzero">
            <path d="M249.300076,45.0082791 C217.54955,44.7056618 169.281728,54.8871237 104.496611,71.1763918 L104.496611,224.930358 C104.496611,330.833378 154.884968,407.523259 253.351584,455 C348.489385,407.523259 397,329.112853 397,223.209832 L397,68.9882554 C329.980914,52.6989873 282.145448,44.7056618 249.300076,45.0082791 Z M104.496611,71.1763918 L104.496611,224.930358" class="shield-border" stroke="#000000" stroke-width="5" stroke-linejoin="round"></path>
            <path d="M255.014881,446 C290.588483,427.696371 318.506668,406.225332 338.101074,382.52648 C387.401333,322.899283 391.998938,257.894353 391.998938,257.894353 C391.998938,257.894353 391.999047,239.288165 391.999265,202.075789 C391.999382,182.184504 391.999627,140.385937 392,76.680085 L363.984057,70 C363.983683,130.859574 363.9845,177.177996 363.984384,196.180569 C363.984166,231.730354 363.984057,249.505247 363.984057,249.505247 C363.984057,249.505247 352.078114,367.725721 227,429.206627 L255.014881,446 Z" class="shield-shadow" fill="#D8D8D8"></path>
            <polyline class="shield-checkmark" stroke="#DF3434" stroke-width="5" points="212 228.953722 250.199906 262 311 190"></polyline>
        </g>
    </g>
</svg>