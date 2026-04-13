<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\DirectionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PosteController;

// ==================== ROUTES AUTH ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==================== ROUTES POSTES ====================
Route::get('/postes', [PosteController::class, 'index']);
Route::post('/postes', [PosteController::class, 'store']);
Route::get('/postes/{id}', [PosteController::class, 'show']);
Route::put('/postes/{id}', [PosteController::class, 'update']);
Route::delete('/postes/{id}', [PosteController::class, 'destroy']);

// ==================== ROUTES SERVICES ====================
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
Route::get('/services/direction/{directionId}', [ServiceController::class, 'getByDirection']);

// ==================== ROUTES DIRECTIONS ====================
Route::get('/directions', [DirectionController::class, 'index']);
Route::post('/directions', [DirectionController::class, 'store']);
Route::put('/directions/{id}', [DirectionController::class, 'update']);
Route::delete('/directions/{id}', [DirectionController::class, 'destroy']);

// ==================== ROUTES PERSONNELS ====================
Route::get('/personnels', [PersonnelController::class, 'index']);
Route::post('/personnels', [PersonnelController::class, 'store']);
Route::put('/personnels/{id}', [PersonnelController::class, 'update']);
Route::delete('/personnels/{id}', [PersonnelController::class, 'destroy']);
Route::get('/personnels/stats', [PersonnelController::class, 'stats']);

// ==================== ROUTES CARRIERES ====================
Route::get('/carrieres', [CarriereController::class, 'index']);
Route::post('/carrieres', [CarriereController::class, 'store']);
Route::put('/carrieres/{id}', [CarriereController::class, 'update']);
Route::delete('/carrieres/{id}', [CarriereController::class, 'destroy']);

// ==================== ROUTES HISTORIQUE ====================
Route::get('/historiques', [HistoriqueController::class, 'index']);
Route::post('/historiques', [HistoriqueController::class, 'store']);
Route::put('/historiques/{id}', [HistoriqueController::class, 'update']);
Route::delete('/historiques/{id}', [HistoriqueController::class, 'destroy']);
Route::get('/historiques/personnel/{personnelId}', [HistoriqueController::class, 'getByPersonnel']);

// ==================== ROUTES BASE ROHI ====================
Route::get('/base-rohi', [BaseRohiController::class, 'index']);
Route::post('/base-rohi', [BaseRohiController::class, 'store']);
Route::put('/base-rohi/{id}', [BaseRohiController::class, 'update']);
Route::delete('/base-rohi/{id}', [BaseRohiController::class, 'destroy']);
Route::get('/personnels-rohi', [BaseRohiController::class, 'getLiaisons']);
Route::post('/personnels-rohi', [BaseRohiController::class, 'addLiaison']);
Route::delete('/personnels-rohi/{personnelId}/{rohiId}', [BaseRohiController::class, 'removeLiaison']);

// ==================== ROUTES BASE AUGURE ====================
Route::get('/base-augure', [BaseAugureController::class, 'index']);
Route::post('/base-augure', [BaseAugureController::class, 'store']);
Route::put('/base-augure/{id}', [BaseAugureController::class, 'update']);
Route::delete('/base-augure/{id}', [BaseAugureController::class, 'destroy']);
Route::get('/personnels-augure', [BaseAugureController::class, 'getLiaisons']);
Route::post('/personnels-augure', [BaseAugureController::class, 'addLiaison']);
Route::delete('/personnels-augure/{personnelId}/{augureId}', [BaseAugureController::class, 'removeLiaison']);

// ==================== ROUTES STATUTS ADMIN ====================
Route::get('/statuts', [StatutAdminController::class, 'index']);
Route::post('/statuts', [StatutAdminController::class, 'store']);
Route::put('/statuts/{id}', [StatutAdminController::class, 'update']);
Route::delete('/statuts/{id}', [StatutAdminController::class, 'destroy']);

// ==================== ROUTES SITUATIONS ADMIN ====================
Route::get('/situations-admin', [SituationAdminController::class, 'index']);
Route::post('/situations-admin', [SituationAdminController::class, 'store']);
Route::put('/situations-admin/{id}', [SituationAdminController::class, 'update']);
Route::delete('/situations-admin/{id}', [SituationAdminController::class, 'destroy']);

// ==================== ROUTES ETATS ====================
Route::get('/etats', [EtatController::class, 'index']);
Route::post('/etats', [EtatController::class, 'store']);
Route::put('/etats/{id}', [EtatController::class, 'update']);
Route::delete('/etats/{id}', [EtatController::class, 'destroy']);

// ==================== ROUTES AUTH ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==================== ROUTES PROTÉGÉES ====================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/check-initialized', [AuthController::class, 'checkInitialized']);
    Route::post('/user/complete-setup', [AuthController::class, 'completeSetup']);
});

// ==================== ROUTES USERS ====================
Route::get('/users', [UserController::class, 'index']);