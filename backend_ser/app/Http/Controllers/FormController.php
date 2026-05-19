<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FormController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TODO: implement formulaire processing logic
        return response()->json([
            'message' => 'Formulaire reçu avec succès',
            'data' => $request->all(),
        ]);
    }
}
