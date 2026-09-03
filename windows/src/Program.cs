using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace OMINIX
{
    class Program
    {
        private static readonly HttpClient httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(3) };
        private const string ServerUrl = "http://localhost:3000";

        static async Task Main(string[] args)
        {
            Console.Title = "OMINIX Office AI - Desktop Bridge v1.0.0";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(@"
   ____  __  __ _____ _   _ _____  __
  / __ \|  \/  |_   _| \ | |_   _| \ \ / /
 | |  | | \  / | | | |  \| | | |    \ V / 
 | |  | | |\/| | | | | . ` | | |     > <  
 | |__| | |  | |_| |_| |\  |_| |_   / . \ 
  \____/|_|  |_|_____|_| \_|_____| /_/ \_\
            OFFICE AI ENGINE
");
            Console.ResetColor();
            Console.WriteLine("=============================================================");
            Console.WriteLine(" Developer: Mr Ali (https://github.com/ali-shortcuts)");
            Console.WriteLine(" Office Integration: Word | Excel | PowerPoint");
            Console.WriteLine("=============================================================\n");

            // Step 1: Install & Register Office Add-in Manifest
            RegisterOfficeAddin();

            // Step 2: Ensure OMINIX Backend Server is Online
            await EnsureServerRunningAsync();

            // Step 3: Open Office or Browser Taskpane
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("\n[✓] OMINIX Office AI Engine is active!");
            Console.ResetColor();
            Console.WriteLine($"[i] Taskpane URL: {ServerUrl}");
            Console.WriteLine("[i] Open Microsoft Word, Excel, or PowerPoint to view the OMINIX ribbon tab.");
            Console.WriteLine("[i] Press 'O' to open the Taskpane in your browser.");
            Console.WriteLine("[i] Press 'W' to launch Microsoft Word.");
            Console.WriteLine("[i] Press 'E' to launch Microsoft Excel.");
            Console.WriteLine("[i] Press 'P' to launch Microsoft PowerPoint.");
            Console.WriteLine("[i] Press 'Q' to exit.\n");

            // Open browser automatically
            TryOpenUrl(ServerUrl);

            while (true)
            {
                var key = Console.ReadKey(true).Key;
                if (key == ConsoleKey.Q) break;
                if (key == ConsoleKey.O) TryOpenUrl(ServerUrl);
                if (key == ConsoleKey.W) TryLaunchApp("winword");
                if (key == ConsoleKey.E) TryLaunchApp("excel");
                if (key == ConsoleKey.P) TryLaunchApp("powerpnt");
            }
        }

        private static void RegisterOfficeAddin()
        {
            try
            {
                Console.WriteLine("[*] Registering Office Add-in Manifest...");
                string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                string ominixFolder = Path.Combine(appData, "Microsoft", "Office", "OMINIX-Addin");

                if (!Directory.Exists(ominixFolder))
                {
                    Directory.CreateDirectory(ominixFolder);
                }

                // Look for manifest.xml in relative paths
                string[] possibleManifestPaths = {
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "manifest.xml"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "manifest.xml"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "office-addin", "manifest.xml")
                };

                string? sourceManifest = null;
                foreach (var p in possibleManifestPaths)
                {
                    if (File.Exists(p))
                    {
                        sourceManifest = p;
                        break;
                    }
                }

                if (sourceManifest != null)
                {
                    string targetManifest = Path.Combine(ominixFolder, "manifest.xml");
                    File.Copy(sourceManifest, targetManifest, true);
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine($"[✓] Manifest successfully installed to: {targetManifest}");
                    Console.ResetColor();
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("[!] Note: manifest.xml should be placed alongside OMINIX.exe for full auto-registration.");
                    Console.ResetColor();
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[!] Notice during manifest registration: {ex.Message}");
                Console.ResetColor();
            }
        }

        private static async Task EnsureServerRunningAsync()
        {
            Console.WriteLine("[*] Checking OMINIX server status...");
            bool isOnline = await IsServerOnlineAsync();

            if (isOnline)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("[✓] OMINIX backend server is already running on port 3000.");
                Console.ResetColor();
                return;
            }

            Console.WriteLine("[*] Starting local OMINIX server...");
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c npm start || node dist/server.cjs",
                    WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                Process.Start(startInfo);
                
                // Wait for up to 10 seconds for server to respond
                for (int i = 0; i < 10; i++)
                {
                    await Task.Delay(1000);
                    if (await IsServerOnlineAsync())
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine("[✓] Server started successfully!");
                        Console.ResetColor();
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[!] Server launcher note: {ex.Message}");
                Console.ResetColor();
            }
        }

        private static async Task<bool> IsServerOnlineAsync()
        {
            try
            {
                var res = await httpClient.GetAsync($"{ServerUrl}/api/health");
                return res.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }

        private static void TryOpenUrl(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch { }
        }

        private static void TryLaunchApp(string appName)
        {
            try
            {
                Console.WriteLine($"[*] Launching {appName}...");
                Process.Start(new ProcessStartInfo
                {
                    FileName = appName,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[!] Could not launch {appName}: {ex.Message}");
                Console.ResetColor();
            }
        }
    }
}
