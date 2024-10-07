<?php

namespace ScreenSnap\Commands;

use Exception;
use Illuminate\Console\Command;

class ScreenSnapCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'screen-snap:take
        {--savePath= : Optional path to save the screenshots. If not provided, the configuration default path will be used}
        {--url= : URL to capture the screenshot, when capturing a single one}
        {--fileName= : Name of the file where the screenshot will be saved, when capturing a single one}
        {--stepsToReproduce= : JSON formatted string of steps to reproduce before taking the screenshot, when capturing a single one}
        {--data= : JSON data or file path for batch screenshot capture}
        {--loginUrl= : URL to the login page of the application}
        {--loginUsername= : Username for login}
        {--loginPassword= : Password for login}
        {--loginUsernameFieldSelector= : CSS selector for the username field}
        {--loginPasswordFieldSelector= : CSS selector for the password field}
        {--loginSubmitButtonSelector= : CSS selector for the login submit button}
        {--pageNavigationTimeout= : Optional timeout for page navigation}
        {--screenshotWidth= : Width of the screenshot}
        {--screenshotHeight= : Height of the screenshot}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run script to take screenshots of the given URL or URLs.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $url = $this->option('url') ?? null;
        $fileName = $this->option('fileName') ?? null;
        $stepsToReproduce = $this->option('stepsToReproduce') ?? null;

        $data = $this->option('data') ?? config('screen-snap.screensnap_data_file');

        $savePath = $this->option('savePath') ?? config('screen-snap.screensnap_save_path');

        $loginUrl = $this->option('loginUrl') ?? config('screen-snap.screensnap_login_url');
        $loginUsername = $this->option('loginUsername') ?? config('screen-snap.screensnap_login_username');
        $loginPassword = $this->option('loginPassword') ?? config('screen-snap.screensnap_login_password');
        $loginUsernameFieldSelector = $this->option('loginUsernameFieldSelector') ?? config('screen-snap.screensnap_login_username_field_selector');
        $loginPasswordFieldSelector = $this->option('loginPasswordFieldSelector') ?? config('screen-snap.screensnap_login_password_field_selector');
        $loginSubmitButtonSelector = $this->option('loginSubmitButtonSelector') ?? config('screen-snap.screensnap_login_submit_button_selector');

        $pageNavigationTimeout = $this->option('pageNavigationTimeout') ?? null;
        $screenshotWidth = $this->option('screenshotWidth') ?? null;
        $screenshotHeight = $this->option('screenshotHeight') ?? null;

        $this->verifySavePath($savePath);

        if ($url) {
            $this->takeSingleScreenshots(
                $url,
                $stepsToReproduce,
                $fileName,
                $savePath,
                $loginUrl,
                $loginUsername,
                $loginPassword,
                $loginUsernameFieldSelector,
                $loginPasswordFieldSelector,
                $loginSubmitButtonSelector,
                $pageNavigationTimeout,
                $screenshotWidth,
                $screenshotHeight
            );
        } else if ($data) {
            $jsonContent = null;

            try {
                $jsonContent = $this->getJsonContent($data);
            } catch (Exception $e) {
                echo 'Error: ' . $e->getMessage();
            }

            $this->takeBatchScreenshots(
                $jsonContent,
                $savePath,
                $loginUrl,
                $loginUsername,
                $loginPassword,
                $loginUsernameFieldSelector,
                $loginPasswordFieldSelector,
                $loginSubmitButtonSelector,
                $pageNavigationTimeout,
                $screenshotWidth,
                $screenshotHeight
            );
        } else {
            $this->error('No URL or data file provided.');
            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    /**
     * Run the Node.js script in single screenshot mode.
     */
    private function takeSingleScreenshots(
        $url,
        $stepsToReproduce,
        $fileName,
        $savePath,
        $loginUrl,
        $loginUsername,
        $loginPassword,
        $loginUsernameFieldSelector,
        $loginPasswordFieldSelector,
        $loginSubmitButtonSelector,
        $pageNavigationTimeout,
        $screenshotWidth,
        $screenshotHeight
    ): void {

        $command = sprintf(
            'node ../../assets/js/screen-snap-script.js --url=%s --stepsToReproduce=%s --fileName=%s --savePath=%s --loginUrl=%s --loginUsername=%s --loginPassword=%s --loginUsernameFieldSelector=%s --loginPasswordFieldSelector=%s --loginSubmitButtonSelector=%s --pageNavigationTimeout=%s --screenshotWidth=%s --screenshotHeight=%s',
            escapeshellarg($url),
            escapeshellarg($stepsToReproduce),
            escapeshellarg($fileName),
            escapeshellarg($savePath),
            escapeshellarg($loginUrl),
            escapeshellarg($loginUsername),
            escapeshellarg($loginPassword),
            escapeshellarg($loginUsernameFieldSelector),
            escapeshellarg($loginPasswordFieldSelector),
            escapeshellarg($loginSubmitButtonSelector),
            escapeshellarg($pageNavigationTimeout),
            escapeshellarg($screenshotWidth),
            escapeshellarg($screenshotHeight)
        );

        $output = [];
        exec($command, $output, $exitCode);

        if (!empty($output)) {
            $this->info("Log Output:");
            $this->line($output);
            $this->info("");
        }
    }

    /**
     * Run the Node.js script in batch screenshot mode.
     */
    private function takeBatchScreenshots(
        $urlsToCapture,
        $savePath,
        $loginUrl,
        $loginUsername,
        $loginPassword,
        $loginUsernameFieldSelector,
        $loginPasswordFieldSelector,
        $loginSubmitButtonSelector,
        $pageNavigationTimeout,
        $screenshotWidth,
        $screenshotHeight
    ): void {
        // Ensure that JSON is properly encoded for command-line execution
        $encodedData = json_encode($urlsToCapture);

        // Prepare the Node.js command with or without the savePath
        $command = sprintf(
            'node ../../assets/js/screen-snap-script.js --data=%s --savePath=%s --loginUrl=%s --loginUsername=%s --loginPassword=%s --loginUsernameFieldSelector=%s --loginPasswordFieldSelector=%s --loginSubmitButtonSelector=%s --pageNavigationTimeout=%s --screenshotWidth=%s --screenshotHeight=%s',
            escapeshellarg($encodedData),
            escapeshellarg($savePath),
            escapeshellarg($loginUrl),
            escapeshellarg($loginUsername),
            escapeshellarg($loginPassword),
            escapeshellarg($loginUsernameFieldSelector),
            escapeshellarg($loginPasswordFieldSelector),
            escapeshellarg($loginSubmitButtonSelector),
            escapeshellarg($pageNavigationTimeout),
            escapeshellarg($screenshotWidth),
            escapeshellarg($screenshotHeight)
        );

        $output = [];
        exec($command, $output, $exitCode);

        if (!empty($output)) {
            $this->info("Log Output:");
            $this->line(implode("\n", $output));
        }

        if ($exitCode === 0) {
            $this->info("Batch screenshots completed successfully.");
        } else {
            $this->error("An error occurred while taking batch screenshots.");
        }
    }

    /**
     * Verify that the save path exists and is writable.
     */
    private function verifySavePath($savePath): void
    {
        if (!is_dir($savePath)) {
            $this->error("The save path does not exist: $savePath");

            // Ask the user if they want to create the directory
            if ($this->confirm("Do you want to create the save path?")) {
                // Attempt to create the directory
                if (mkdir($savePath, 0755, true)) {
                    $this->info("The save path has been created: $savePath");
                } else {
                    $this->error("Failed to create the save path.");
                    exit(1);
                }
            } else {
                exit(1); // Exit if user does not want to create the directory
            }
        }

        if (!is_writable($savePath)) {
            $this->error("The save path is not writable: $savePath");

            // Ask the user if they want to make the directory writable
            if ($this->confirm("Do you want to make the save path writable?")) {
                // Attempt to change the permissions
                if (chmod($savePath, 0755)) {
                    $this->info("The save path is now writable: $savePath");
                } else {
                    $this->error("Failed to make the save path writable.");
                    exit(1);
                }
            } else {
                exit(1); // Exit if user does not want to change permissions
            }
        }
    }

    /**
     * Get the JSON content from a file or a JSON string.
     */
    function getJsonContent(string $input): mixed
    {
        // Check if the input is a valid file path
        if (is_file($input) && file_exists($input)) {
            // If it's a valid file, extract the content
            $fileContent = file_get_contents($input);

            // Verify if the file content is valid JSON
            $jsonData = json_decode($fileContent, true); // Decoding to associative array
            if (json_last_error() === JSON_ERROR_NONE) {
                return $jsonData; // Return the decoded JSON content
            } else {
                throw new Exception("Invalid JSON content in file.");
            }
        } else {
            // If it's not a valid file, treat it as a JSON string and decode it
            $jsonData = json_decode($input, true); // Decoding to associative array

            if (json_last_error() === JSON_ERROR_NONE) {
                return $jsonData; // Return the decoded JSON content
            } else {
                throw new Exception("Input is neither a valid JSON string nor a file path.");
            }
        }
    }
}
