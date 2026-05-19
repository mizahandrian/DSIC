<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        return User::create([
            'name' => $request->name,
            'prenom' => $request->prenom,
            'age' => $request->age,
            'sexe' => $request->sexe,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'status' => 'actif',
            'password' => Hash::make($request->password),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'prenom' => $request->prenom,
            'age' => $request->age,
            'sexe' => $request->sexe,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
        ]);

        return $user;
    }

    public function destroy(int $id)
    {
        return User::destroy($id);
    }
}