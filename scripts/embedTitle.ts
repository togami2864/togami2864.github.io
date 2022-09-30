export const embedTitle = (title: string) => {
  return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="viewport" content="width=1200,height=630" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap" rel="stylesheet" />
    <title>OGP</title>
    <style>
        body,
        h1 {
            margin: 0;
            font-family: "Noto Sans JP", sans-serif;
        }

        :root {
            --og-width: 1200px;
            --og-height: 630px;
            --og-padding: 60px;
            --og-inner-padding: 30px;
            --og-inner-height: calc(var(--og-height) - var(--og-padding) * 2);
            --og-inner-width: calc(var(--og-width) - var(--og-padding) * 2);
        }

        #root {
            width: 1200px;
            height: 630px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #main {
            background-color: white;
            border: 12px solid #5fedff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: calc(var(--og-inner-height) - var(--og-inner-padding) * 2);
            width: calc(var(--og-inner-width) - var(--og-inner-padding) * 2);
        }

        #title {
            font-weight: bold;
        }

        #name {
            font-size: 24px;
        }
    </style>
</head>

<body>
    <div id="root">
        <div id="main">
            <h1 id="title">${title}</h1>
            <p id="name">@togami2864</p>
        </div>
    </div>
</body>

</html>`;
};
