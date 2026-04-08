<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\DirectionController;

Route::apiResource('directions', DirectionController::class);
Route::apiResource('personnels', PersonnelController::class);
Route::get('/personnels', [PersonnelController::class, 'index']);
Route::post('/personnels', [PersonnelController::class, 'store']);
Route::put('/personnels/{id}', [PersonnelController::class, 'update']);
Route::delete('/personnels/{id}', [PersonnelController::class, 'destroy']);

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