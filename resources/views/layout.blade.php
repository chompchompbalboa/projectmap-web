<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Project Map</title>

        <!-- Vite -->
        @viteReactRefresh
        @vite('resources/css/index.css')

        <!-- React Bundle -->
        @yield('react-bundle')
    </head>
    <body class="font-sans antialiased">
        <section id="react-container"></section>
    </body>
</html>