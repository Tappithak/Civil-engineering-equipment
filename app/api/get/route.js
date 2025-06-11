// app/api/sheets/route.js
import { getSheetData, appendToSheet } from '../config';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const result = req.nextUrl.searchParams.get('dbname');
    let range = "";
    
    switch (result) {
        case 'equip':
            range = 'data_equip!A1:K';
            break;
        case 'categoryequipments':
            range = 'data_menu!A1:G';
            break;
        case 'personnel':
            range = 'personnel!A1:H';
            break;
        case 'documents':
            range = 'documents!A1:F';
            break;
        default:
            range = 'data_equip!A1:I';
            break; // ย้าย break มาไว้หลัง default
    }
    
    const data = await getSheetData(range);
    
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No data found.' }, { status: 404 });
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const formattedData = rows.map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index];
      });
      return item;
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Error fetching sheet data', error: error.message },
      { status: 500 }
    );
  }
}