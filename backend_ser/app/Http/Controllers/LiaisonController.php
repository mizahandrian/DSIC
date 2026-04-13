<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LiaisonController extends Controller
{
    // =====================================================
    // 🔵 ROHI
    // =====================================================

    public function index()
    {
        return DB::table('personnels_rohi')->get();
    }

    public function store(Request $request)
    {
        DB::table('personnels_rohi')->insert([
            'id_personnel' => $request->id_personnel,
            'id_rohi' => $request->id_rohi,
            'date_liaison' => now()
        ]);

        return ['message' => 'liaison ROHI créée'];
    }

    public function destroy($personnelId, $rohiId)
    {
        DB::table('personnels_rohi')
            ->where('id_personnel', $personnelId)
            ->where('id_rohi', $rohiId)
            ->delete();

        return ['message' => 'liaison ROHI supprimée'];
    }

    // =====================================================
    // 🟢 AUGURE
    // =====================================================

    public function indexAugure()
    {
        return DB::table('personnels_augure')->get();
    }

    public function storeAugure(Request $request)
    {
        DB::table('personnels_augure')->insert([
            'id_personnel' => $request->id_personnel,
            'id_augure' => $request->id_augure,
            'date_liaison' => now()
        ]);

        return ['message' => 'liaison AUGURE créée'];
    }

    public function destroyAugure($personnelId, $augureId)
    {
        DB::table('personnels_augure')
            ->where('id_personnel', $personnelId)
            ->where('id_augure', $augureId)
            ->delete();

        return ['message' => 'liaison AUGURE supprimée'];
    }
}