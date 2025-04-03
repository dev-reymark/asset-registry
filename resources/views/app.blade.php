<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="Assets Registry">
        <meta name="author" content="Rey Mark Tapar">
        <title inertia>{{ config('app.name') . ' - Assets Registry' }}</title>
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
        
    </head>
    <body>
        @inertia
    </body>
</html>