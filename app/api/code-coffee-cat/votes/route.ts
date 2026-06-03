import { NextResponse } from "next/server";
import { supabaseAdmin, isUsingServiceRole } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type VoteRow = {
  user_id?: string;
  voter_id?: string;
  mascot_ids: string[] | null;
  apparel_types: string[] | null;
  created_at?: string;
  updated_at?: string;
};

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("votes")
    .select("user_id, voter_id, mascot_ids, apparel_types, created_at, updated_at")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        votes: [],
        error: error.message,
        usingServiceRole: isUsingServiceRole,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  return NextResponse.json(
    {
      votes: (data || []) as VoteRow[],
      error: null,
      usingServiceRole: isUsingServiceRole,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
