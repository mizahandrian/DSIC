<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // REGISTER - MODIFIÉ
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|min:2',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_initialized' => false, // ✅ NOUVEAU : par défaut non initialisé
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ MODIFIÉ : retourner is_initialized
        return response()->json([
            'message' => 'User created successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_initialized' => $user->is_initialized,
            ],
            'token' => $token
        ], 201);
    }

    // LOGIN - MODIFIÉ
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ MODIFIÉ : retourner is_initialized
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_initialized' => $user->is_initialized ?? false,
            ],
            'token' => $token
        ]);
    }

    // LOGOUT - Inchangé
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // ✅ NOUVEAU : Marquer l'utilisateur comme initialisé
    public function completeSetup(Request $request)
    {
        $user = $request->user();
        $user->is_initialized = true;
        $user->save();

        return response()->json([
            'message' => 'Setup completed successfully',
            'is_initialized' => true
        ]);
    }

    // ✅ NOUVEAU : Vérifier si l'utilisateur est initialisé
    public function checkInitialized(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'is_initialized' => $user->is_initialized ?? false
        ]);
    }

    // ✅ NOUVEAU : Récupérer l'utilisateur connecté
    public function getUser(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_initialized' => $user->is_initialized ?? false,
        ]);
    }
}