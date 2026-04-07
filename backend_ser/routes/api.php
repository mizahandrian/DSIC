<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


/*
|--------------------------
| AUTH ROUTES
|--------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------
| PROTECTED ROUTES
|--------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);

});

/*
|--------------------------
| USERS LIST (DEBUG / ADMIN)
|--------------------------
*/
Route::get('/users', [UserController::class, 'index']);