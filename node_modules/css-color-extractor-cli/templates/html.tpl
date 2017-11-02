<!DOCTYPE html>
<html>
<head>
    <title>Colors</title>
    <style>
        .container {
            max-width: 640px;
            margin: 0 auto;
        }
        .swatches {
            width: 100%;
            margin: 0;
            padding: 0;
            list-style: none;
        }
        .swatch {
            width: 100%;
            display: block;
            height: 80px;
            color: black;
            font: 24px/30px Arial, sans-serif;
            box-sizing: border-box;
            text-align: center;
            padding: 20px;
        }
        .swatch-dark {
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <ul class="swatches"><% _.each(colors, function(color){ %>
            <li class="swatch <%= colorObj(color).dark() ? 'swatch-dark' : 'swatch-light' %>" style="background-color: <%= color %>;"><%= color %></li><% }); %>
        </ul>
    </div>
</body>
</html>
