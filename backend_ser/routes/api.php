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
use Illuminate\Support\Facades\Password;



//test 
use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {
    Mail::raw('Test Mailtrap OK', function ($msg) {
        $msg->to('test@mail.com')
            ->subject('Test');
    });

    return 'Email envoyé';
});


//mot de pass
//use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Models\User;

Route::post('/forgot-password', function (Request $request) {

    $request->validate(['email' => 'required|email']);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Email introuvable'], 404);
    }

    $otp = rand(100000, 999999);

    $user->otp_code = $otp;
    $user->otp_expires_at = Carbon::now()->addMinutes(10);
    $user->save();

    Mail::raw("Votre code est : $otp", function ($message) use ($user) {
        $message->to($user->email)
                ->subject('Code de réinitialisation');
    });

    return response()->json(['message' => 'Code envoyé']);
});

//verifier le code

Route::post('/verify-code', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'otp' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || $user->otp_code != $request->otp) {
        return response()->json(['message' => 'Code invalide'], 400);
    }

    if (now()->greaterThan($user->otp_expires_at)) {
        return response()->json(['message' => 'Code expiré'], 400);
    }

    return response()->json(['message' => 'Code valide']);
});
//reset mot de passe
use Illuminate\Support\Facades\Hash;

Route::post('/reset-password', function (Request $request) {

    $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user) {
        return response()->json(['message' => 'Utilisateur introuvable'], 404);
    }

    $user->password = Hash::make($request->password);
    $user->otp_code = null;
    $user->otp_expires_at = null;
    $user->save();

    return response()->json(['message' => 'Mot de passe changé']);
});

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
Route::get('/services/direction/{id}', [ServiceController::class, 'getByDirection']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
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
Route::get('/historiques/{id}', [HistoriqueController::class, 'show']);
Route::put('/historiques/{id}', [HistoriqueController::class, 'update']);
Route::delete('/historiques/{id}', [HistoriqueController::class, 'destroy']);

// ==================== ROUTES BASE ROHI ====================
Route::get('/base-rohi', [BaseRohiController::class, 'index']);
Route::post('/base-rohi', [BaseRohiController::class, 'store']);
Route::put('/base-rohi/{id}', [BaseRohiController::class, 'update']);
Route::delete('/base-rohi/{id}', [BaseRohiController::class, 'destroy']);

Route::get('/personnels', [PersonnelController::class, 'index']);

Route::get('/personnels-rohi', [LiaisonController::class, 'index']);
Route::post('/personnels-rohi', [LiaisonController::class, 'store']);
Route::delete('/personnels-rohi/{personnelId}/{rohiId}', [LiaisonController::class, 'destroy']);

// ==================== ROUTES BASE AUGURE ====================
Route::get('/base-augure', [BaseAugureController::class, 'index']);
Route::post('/base-augure', [BaseAugureController::class, 'store']);
Route::put('/base-augure/{id}', [BaseAugureController::class, 'update']);
Route::delete('/base-augure/{id}', [BaseAugureController::class, 'destroy']);

Route::get('/personnels', [PersonnelController::class, 'index']);

Route::get('/personnels-augure', [LiaisonController::class, 'index']);
Route::post('/personnels-augure', [LiaisonController::class, 'store']);
Route::delete('/personnels-augure/{personnelId}/{augureId}', [LiaisonController::class, 'destroy']);
// ==================== ROUTES STATUTS ADMIN ====================
Route::get('/statuts', [StatutController::class, 'index']);
Route::post('/statuts', [StatutController::class, 'store']);
Route::put('/statuts/{id}', [StatutController::class, 'update']);
Route::delete('/statuts/{id}', [StatutController::class, 'destroy']);

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

//route personnel vaovao
Route::get('/directions', [DirectionController::class, 'index']);
Route::get('/postes', [PosteController::class, 'index']);
Route::get('/carrieres', [CarriereController::class, 'index']);
Route::get('/statuts', [StatutController::class, 'index']);
Route::get('/etats', [EtatController::class, 'index']);

Route::get('/services/direction/{id}', [ServiceController::class, 'getByDirection']);

Route::post('/personnels', [PersonnelController::class, 'store']);
Route::post('/historiques', [HistoriqueController::class, 'store']);