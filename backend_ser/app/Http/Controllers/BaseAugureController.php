<?php

namespace App\Http\Controllers;

use App\Models\BaseAugure;
use Illuminate\Http\Request;

class BaseAugureController extends Controller
{
    public function index()
    {
        return BaseAugure::all();
    }

    public function store(Request $request)
    {
        return BaseAugure::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $augure = BaseAugure::findOrFail($id);
        $augure->update($request->all());
        return $augure;
    }

    public function destroy($id)
    {
        BaseAugure::destroy($id);
        return ['message' => 'supprimé'];
    }
}
