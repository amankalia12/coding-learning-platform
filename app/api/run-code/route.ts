

// export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import { execFile } from "child_process";
// import { promisify } from "util";
// import fs from "fs/promises";
// import path from "path";
// import crypto from "crypto";

// const execFileAsync = promisify(execFile);

// // 🔒 CHANGE THIS IF YOUR SANDBOX PATH IS DIFFERENT
// const SANDBOX_BASE = "C:/docker-test";

// async function runSql(code: string, jobDir: string) {
//   const fs = await import("fs/promises");
//   const path = await import("path");
//   const { execFile } = await import("child_process");
//   const { promisify } = await import("util");

//   const execFileAsync = promisify(execFile);

//   // 1️⃣ Write SQL to file
//   const sqlFilePath = path.join(jobDir, "lesson.sql");
//   await fs.writeFile(sqlFilePath, code);

  

//   // 2️⃣ Run SQLite in Docker
//   const { stdout, stderr } = await execFileAsync(
//     "docker",
//     [
//       "run",
//       "--rm",
//       "--network=none",
//       "-v",
//       `${jobDir}:/code`,
//       "nouchka/sqlite3",
//       "/code/db.sqlite",
//       ".mode",
//       "list",
//       ".headers",
//       "off",
//       ".read",
//       "/code/lesson.sql",
//     ],
//     {
//       timeout: 5000,
//       maxBuffer: 1024 * 1024,
//     }
//   );

//   return { stdout, stderr };
// }


// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { language, code } = body;

//     // 1️⃣ Validate input
//     if (!code || typeof code !== "string") {
//       return NextResponse.json(
//         { error: "Code is required" },
//         { status: 400 }
//       );
//     }
   

//     if (language !== "python") {
//       return NextResponse.json(
//         { error: "Only Python is supported" },
//         { status: 400 }
//     );
// }
  
    

//     // 2️⃣ Create isolated job folder
//     const jobId = crypto.randomUUID();
//     const jobDir = path.join(SANDBOX_BASE, jobId);

//     await fs.mkdir(jobDir, { recursive: true });

//     // 3️⃣ Write student code to file
//     const codePath = path.join(jobDir, "student_code.py");
//     await fs.writeFile(codePath, code);

//     // 4️⃣ Run code INSIDE Docker (not on server!)
//     const { stdout, stderr } = await execFileAsync(
//       "docker",
//       [
//         "run",
//         "--rm",
//         "--cpus=0.5",
//         "--memory=128m",
//         "--pids-limit=64",
//         "--network=none",
//         "--read-only",
//         "-v",
//         `${jobDir}:/code`,
//         "python:3.12-slim",
//         "python",
//         "/code/student_code.py",
//       ],
//       {
//         timeout: 6000,
//         maxBuffer: 1024 * 1024,
//       }
//     );

//     // 5️⃣ Return result to frontend
//     return NextResponse.json({
//       stdout,
//       stderr,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       {
//         error: err.stderr || err.message || "Execution failed",
//       },
//       { status: 500 }
//     );
//   }
// }

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { supabase } from "@/lib/supabaseClient";

const execFileAsync = promisify(execFile);

// 🔒 CHANGE THIS ONLY IF YOUR PATH IS DIFFERENT
const SANDBOX_BASE = "C:/docker-sandbox";

type LessonLanguageResult = {
  id: string;
  chapter: {
    id: string;
    course: {
      id: string;
      language: string;
    } | null;
  } | null;
};

async function getCourseLanguageByLesson(lessonId: string) {
  const { data, error } = await supabase
    .from("lessons")
    .select(`
      id,
      chapter:chapters!lessons_chapter_id_fkey (
        id,
        course:courses!chapters_course_id_fkey (
          id,
          language
        )
      )
    `)
    .eq("id", lessonId)
    .single<LessonLanguageResult>();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to load lesson relations");
  }

  if (!data?.chapter?.course?.language) {
    console.error("Resolved data:", JSON.stringify(data, null, 2));
    throw new Error("Could not determine course language");
  }

  return data.chapter.course.language.toLowerCase();
}



export async function POST(req: NextRequest) {
  try {
   
    const { lessonId, code } = await req.json();

    if (!lessonId || !code || typeof code !== "string") {
      return NextResponse.json(
        { error: "lessonId and code are required" },
        { status: 400 }
      );
    }

    // ✅ REAL language resolution from Supabase
   const language = (await getCourseLanguageByLesson(lessonId)).toLowerCase();


    const jobId = crypto.randomUUID();
    const jobDir = path.join(SANDBOX_BASE, jobId);
    await fs.mkdir(jobDir, { recursive: true });

    let result;

    if (language === "python") {
      result = await runPython(code, jobDir);
    } else if (language === "sql") {
      result = await runSql(code, jobDir);
    } else {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
     
  } catch (err: any) {
    return NextResponse.json(
      {
        
        error: err.stderr || err.message || "Execution failed",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   PYTHON RUNNER
   ========================================================= */
async function runPython(code: string, jobDir: string) {
  const filePath = path.join(jobDir, "student_code.py");
  await fs.writeFile(filePath, code);

  const { stdout, stderr } = await execFileAsync(
    "docker",
    [
      "run",
      "--rm",
      "--cpus=0.5",
      "--memory=128m",
      "--pids-limit=64",
      "--network=none",
      "--read-only",
      "-v",
      `${jobDir}:/code`,
      "python:3.12-slim",
      "python",
      "/code/student_code.py",
    ],
    {
      timeout: 6000,
      maxBuffer: 1024 * 1024,
    }
  );

  return { stdout, stderr };
}

/* =========================================================
   SQL RUNNER (SQLite)
   ========================================================= */
async function runSql(code: string, jobDir: string) {
  const sqlFilePath = path.join(jobDir, "lesson.sql");
  await fs.writeFile(sqlFilePath, code);

  const { stdout, stderr } = await execFileAsync(
    "docker",
    [
      "run",
      "--rm",
      "--network=none",
      "-v",
      `${jobDir}:/code`,
      "nouchka/sqlite3",
      "/code/db.sqlite",
      ".mode list",
      ".headers off",
      ".read /code/lesson.sql",
    ],
    {
      timeout: 5000,
      maxBuffer: 1024 * 1024,
    }
  );

  return { stdout, stderr };
}
