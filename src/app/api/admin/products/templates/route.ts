import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib";

export async function GET() {
    try {
        const templates = await DatabaseService.templates.get();
        return NextResponse.json({ templates });
    }
    catch (error) {
        return NextResponse.json({ error: "Error al conectar a la base de datos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Entro al post', body);
        const result = await DatabaseService.templates.create(body);
        console.log('Resultado de la creacion del template', result);
        return NextResponse.json({ 'template created': body });
    }
    catch (error) {
        return NextResponse.json({ error: "Error al crear el template" }, { status: 500 });
    }
}