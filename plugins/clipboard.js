const clipboard = {
  id: "hruby.clipboard",
  tui: async (api) => {
    api.keymap.registerLayer({
      commands: [
        {
          name: "clipboard.copy-last-response",
          title: "Copy last AI response",
          desc: "Copy the last assistant response to the Windows clipboard",
          category: "Clipboard",
          namespace: "palette",
          slashName: "clipboard",
          async run() {
            const route = api.route.current;
            if (route.name !== "session") {
              api.ui.toast({
                variant: "warning",
                message: "Open a session before using /clipboard",
              });
              return;
            }

            const messages = api.state.session.messages(route.params.sessionID);
            const message = messages.findLast((item) => item.role === "assistant");
            if (!message) {
              api.ui.toast({
                variant: "warning",
                message: "No AI response found in this session",
              });
              return;
            }

            const text = api.state
              .part(message.id)
              .filter((part) => part.type === "text" && !part.ignored)
              .map((part) => part.text)
              .join("\n\n")
              .trim();

            if (!text) {
              api.ui.toast({
                variant: "warning",
                message: "The last AI response has no text to copy",
              });
              return;
            }

            try {
              const script = [
                "$stream = [Console]::OpenStandardInput()",
                "$memory = [IO.MemoryStream]::new()",
                "$stream.CopyTo($memory)",
                "$text = [Text.Encoding]::UTF8.GetString($memory.ToArray())",
                "Set-Clipboard -Value $text",
              ].join("; ");
              const process = Bun.spawn(
                [
                  "/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/powershell.exe",
                  "-NoProfile",
                  "-NonInteractive",
                  "-Command",
                  script,
                ],
                { stdin: new Blob([text]), stdout: "ignore", stderr: "pipe" },
              );
              const exitCode = await process.exited;
              if (exitCode === 0) {
                api.ui.toast({
                  variant: "success",
                  message: "Last AI response copied to the Windows clipboard",
                });
                return;
              }

              const error = await new Response(process.stderr).text();
              api.ui.toast({
                variant: "error",
                message: error.trim() || "Could not write to the Windows clipboard",
              });
            } catch (error) {
              api.ui.toast({
                variant: "error",
                message: error instanceof Error ? error.message : "Could not start PowerShell",
              });
            }
          },
        },
      ],
    });
  },
};

export default clipboard;
