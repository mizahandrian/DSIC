<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\DirectionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PosteController;
use App\Http\Controllers\CarriereController;
use App\Http\Controllers\HistoriqueController;
use App\Http\Controllers\BaseRohiController;
use App\Http\Controllers\BaseAugureController;
use App\Http\Controllers\StatutController;
use App\Http\Controllers\SituationAdminController;
use App\Http\Controllers\EtatController;
use App\Http\Controllers\LiaisonController;
use App\Http\Controllers\RecrutementController;
use App\Http\Controllers\SituationPersonnelController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Carbon\Carbon;
use App\Models\User;

// ==================== TEST MAIL ====================
Route::get('/test-mail', function () {
    Mail::raw('Test Mailtrap OK', function ($msg) {
        $msg->to('test@mail.com')->subject('Test');
    });
    return 'Email envoyé';
});

// ==================== MOT DE PASSE ====================
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $user = User::where('email', $request->email)->first();
    if (!$user) return response()->json(['message' => 'Email introuvable'], 404);
    $otp = rand(100000, 999999);
    $user->otp_code = $otp;
    $user->otp_expires_at = Carbon::now()->addMinutes(10);
    $user->save();
    Mail::raw("Votre code est : $otp", function ($message) use ($user) {
        $message->to($user->email)->subject('Code de réinitialisation');
    });
    return response()->json(['message' => 'Code envoyé']);
});

Route::post('/verify-code', function (Request $request) {
    $request->validate(['email' => 'required|email', 'otp' => 'required']);
    $user = User::where('email', $request->email)->first();
    if (!$user || $user->otp_code != $request->otp) return response()->json(['message' => 'Code invalide'], 400);
    if (now()->greaterThan($user->otp_expires_at)) return response()->json(['message' => 'Code expiré'], 400);
    return response()->json(['message' => 'Code valide']);
});

Route::post('/reset-password', function (Request $request) {
    $request->validate(['email' => 'required|email', 'password' => 'required|min:6|confirmed']);
    $user = User::where('email', $request->email)->first();
    if (!$user) return response()->json(['message' => 'Utilisateur introuvable'], 404);
    $user->password = Hash::make($request->password);
    $user->otp_code = null;
    $user->otp_expires_at = null;
    $user->save();
    return response()->json(['message' => 'Mot de passe changé']);
});

// ==================== AUTH ====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ==================== DIRECTIONS ====================
Route::get('/directions', [DirectionController::class, 'index']);
Route::post('/directions', [DirectionController::class, 'store']);
Route::put('/directions/{id}', [DirectionController::class, 'update']);
Route::delete('/directions/{id}', [DirectionController::class, 'destroy']);

// ==================== SERVICES ====================
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/direction/{id}', [ServiceController::class, 'getByDirection']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

// ==================== POSTES ====================
Route::get('/postes', [PosteController::class, 'index']);
Route::post('/postes', [PosteController::class, 'store']);
Route::put('/postes/{id}', [PosteController::class, 'update']);
Route::delete('/postes/{id}', [PosteController::class, 'destroy']);

// ==================== PERSONNELS ====================
Route::get('/personnels', [PersonnelController::class, 'index']);
Route::post('/personnels', [PersonnelController::class, 'store']);
Route::get('/personnels/{id}/anciennete', [PersonnelController::class, 'getAnciennete']);
Route::put('/personnels/{id}', [PersonnelController::class, 'update']);
Route::delete('/personnels/{id}', [PersonnelController::class, 'destroy']);

// ==================== CARRIERES ====================
Route::get('/carrieres', [CarriereController::class, 'index']);
Route::post('/carrieres', [CarriereController::class, 'store']);
Route::put('/carrieres/{id}', [CarriereController::class, 'update']);
Route::delete('/carrieres/{id}', [CarriereController::class, 'destroy']);
Route::apiResource('carrieres', CarriereController::class);

// ==================== HISTORIQUES ====================
Route::get('/historiques', [HistoriqueController::class, 'index']);
Route::post('/historiques', [HistoriqueController::class, 'store']);
Route::get('/historiques/{id}', [HistoriqueController::class, 'show']);
Route::put('/historiques/{id}', [HistoriqueController::class, 'update']);
Route::delete('/historiques/{id}', [HistoriqueController::class, 'destroy']);

// ==================== BASE ROHI ====================
Route::apiResource('base-rohi', BaseRohiController::class);

// ==================== BASE AUGURE ====================
Route::apiResource('base-augure', BaseAugureController::class);

// ==================== STATUTS ====================
Route::get('/statuts', [StatutController::class, 'index']);
Route::post('/statuts', [StatutController::class, 'store']);
Route::put('/statuts/{id}', [StatutController::class, 'update']);
Route::delete('/statuts/{id}', [StatutController::class, 'destroy']);
Route::apiResource('statuts', StatutController::class);

// ==================== SITUATIONS ADMIN ====================
Route::get('/situations-admin', [SituationAdminController::class, 'index']);
Route::post('/situations-admin', [SituationAdminController::class, 'store']);
Route::put('/situations-admin/{id}', [SituationAdminController::class, 'update']);
Route::delete('/situations-admin/{id}', [SituationAdminController::class, 'destroy']);

// ==================== ETATS ====================
Route::get('/etats', [EtatController::class, 'index']);
Route::post('/etats', [EtatController::class, 'store']);
Route::put('/etats/{id}', [EtatController::class, 'update']);
Route::delete('/etats/{id}', [EtatController::class, 'destroy']);

// ==================== RECRUTEMENT ====================
Route::post('/recrutement', [RecrutementController::class, 'store']);
Route::apiResource('recrutement', RecrutementController::class);

// ==================== NOTIFICATIONS (sans auth) ====================
Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);
Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);
Route::post('/notifications', [NotificationController::class, 'store']);
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
Route::delete('/notifications', [NotificationController::class, 'clearAll']);

// ==================== ROUTES PROTEGEES ====================
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/me', [AuthController::class, 'getUser']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/check-initialized', [AuthController::class, 'checkInitialized']);
    Route::post('/user/complete-setup', [AuthController::class, 'completeSetup']);

    Route::post('/formulaire', [\App\Http\Controllers\FormController::class, 'store']);

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    // SUPERADMIN ONLY
    Route::middleware([\App\Http\Middleware\RoleMiddleware::class . ':superadmin'])->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });

    // SITUATION PERSONNELS
    Route::get('situation-personnels/personnel/{id}', [SituationPersonnelController::class, 'getByPersonnel']);
    Route::apiResource('situation-personnels', SituationPersonnelController::class);
});