import subprocess
import os

def upload_nextjs_project():
    try:
        # Step 1: Current folder ka path lo jahan script rakhi hai
        current_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(current_dir)
        
        print(f"Working in: {current_dir}")

        # Step 2: Check karo kya .git folder hai
        if not os.path.exists(".git"):
            print("Error: Ye folder Git se connected nahi hai!")
            return

        # Step 3: Git commands run karo
        print("Staging files...")
        subprocess.run(["git", "add", "."], check=True, shell=True)
        
        print("Committing changes...")
        subprocess.run(["git", "commit", "-m", "Auto-update from Python"], check=True, shell=True)
        
        print("Pushing to GitHub...")
        subprocess.run(["git", "push", "origin", "main"], check=True, shell=True)
        
        print("Success! 🚀")

    except subprocess.CalledProcessError as e:
        print(f"Git Error: {e}")
    except Exception as e:
        print(f"Exception: {e}")

# Run the function
upload_nextjs_project()