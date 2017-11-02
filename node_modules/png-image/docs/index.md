## Classes

<dl>
<dt><a href="#PNGImage">PNGImage</a></dt>
<dd><p>PNGImage</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#compose">compose()</a> ⇒ <code>Promise</code></dt>
<dd><p>Composes multiple images</p>
</dd>
<dt><a href="#runWithPromise">runWithPromise()</a> ⇒ <code>Promise</code></dt>
<dd><p>Runs with a promise</p>
</dd>
<dt><a href="#run">run()</a></dt>
<dd><p>Runs node-style</p>
</dd>
</dl>

<a name="PNGImage"></a>

## PNGImage
PNGImage

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| _imagePath | <code>string</code> | 
| _imageOutputPath | <code>string</code> | 
| _cropImage | <code>object</code> | 
| _composeOffset | <code>object</code> | 
| _imageQueue | <code>Array.&lt;PNG&gt;</code> | 
| _image | <code>PNG</code> | 

<a name="new_PNGImage_new"></a>

### new PNGImage(options)

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>object</code> |  |  |
| options.imagePath | <code>Array.&lt;object&gt;</code> |  | Path to in image file |
| options.imageOutputPath | <code>string</code> |  | Path to output image file |
| [options.cropImage] | <code>object</code> | <code></code> | Cropping for image (default: no cropping) |
| [options.cropImage.x] | <code>int</code> | <code>0</code> | Coordinate for left corner of cropping region |
| [options.cropImage.y] | <code>int</code> | <code>0</code> | Coordinate for top corner of cropping region |
| [options.cropImage.width] | <code>int</code> |  | Width of cropping region (default: Width that is left) |
| [options.cropImage.height] | <code>int</code> |  | Height of cropping region (default: Height that is left) |
| options.composeOffset | <code>int</code> |  | Offset of last composed image to clip (default: no offset) |

<a name="compose"></a>

## compose() ⇒ <code>Promise</code>
Composes multiple images

**Kind**: global function  
**Access:** public  
<a name="runWithPromise"></a>

## runWithPromise() ⇒ <code>Promise</code>
Runs with a promise

**Kind**: global function  
**Access:** public  
<a name="run"></a>

## run()
Runs node-style

**Kind**: global function  
**Access:** public  
