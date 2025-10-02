import * as React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";

// ------- utils -------
const pad = (n) => String(n).padStart(2, "0");

const useCountdown = (targetDate) => {
  const [msLeft, setMsLeft] = React.useState(() => +targetDate - Date.now());

  React.useEffect(() => {
    const id = setInterval(() => setMsLeft(+targetDate - Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const clamped = Math.max(0, msLeft);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { msLeft: clamped, days, hours, minutes, seconds };
};

const fmtLongDate = (date) =>
  date.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

// ------- component -------
export default function CountDown({
  // Midnight local time on Nov 7, 2025
  target = new Date("2025-11-07T00:00:00"),
  title = "Countdown for Growing Pains Getting Added To Tubi",
  buttonText = "It's Time! Take Me to the Tubi Movie!",
  onButtonClick,
  accent = undefined, // e.g. "#7c3aed" to force a brand color; defaults to theme primary
}) {
  const { msLeft, days, hours, minutes, seconds } = useCountdown(target);
  const done = msLeft === 0;

  const today = React.useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const handleClick =
    onButtonClick ??
    (() => {
      if (done) return;
      alert(
        `Easy, it's not added to Tubi yet. It's supposed to be added Friday, November 7th, 2025 and today is ${today}. Come on, why even press it.`
      );
    });

  // dynamic styles
  const accentBg = (theme) => accent ?? theme.palette.primary.main;

  return (
    <Box
      sx={(theme) => ({
        fontFamily: `"Noto Sans", ${theme.typography.fontFamily}`,
        minHeight: 380,
        display: "grid",
        placeItems: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 8 },
        // subtle gradient background that adapts to theme
        background: `linear-gradient(135deg,
          ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"},
          transparent 35%),
          radial-gradient(80% 120% at 50% -10%,
          ${theme.palette.mode === "dark" ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.06)"},
          transparent 60%)`,
      })}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          width: "100%",
          maxWidth: 860,
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          borderRadius: 4,
          backdropFilter: "saturate(120%) blur(6px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.8)",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.07)"
          }`,
        })}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Chip
            label="Holy smokes!!"
            size="small"
            sx={(theme) => ({
              bgcolor: `${accentBg(theme)}1A`, // 10% tint
              color: accent ? "#111" : theme.palette.primary.main,
              borderRadius: 2,
            })}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{ opacity: 0.7, mt: -1 }}
            title={target.toString()}
          >
            Target: {fmtLongDate(target)}
          </Typography>

          <Divider sx={{ width: "100%", my: 0.5 }} />

          {/* Time row */}
          <Box
            role="timer"
            aria-live="polite"
            sx={{
              display: "grid",
              gridAutoFlow: "column",
              alignItems: "stretch",
              gap: { xs: 1.25, sm: 1.5, md: 2 },
            }}
          >
            <TimeBlock label="Days" value={days} accent={accent} />
            <TimeSep />
            <TimeBlock label="Hours" value={pad(hours)} />
            <TimeSep />
            <TimeBlock label="Minutes" value={pad(minutes)} />
            <TimeSep />
            <TimeBlock label="Seconds" value={pad(seconds)} />
          </Box>

          <Button
            variant={done ? "outlined" : "contained"}
            size="large"
            onClick={handleClick}
            disabled={done ? false : false}
            sx={(theme) => ({
              mt: 1,
              px: 3,
              fontWeight: 700,
              borderRadius: 2,
              ...(done
                ? {
                    borderColor: accentBg(theme),
                    color: accent ? accentBg(theme) : theme.palette.primary.main,
                    animation: "pulse 1.2s ease-in-out 2",
                  }
                : {
                    backgroundColor: accentBg(theme),
                    "&:hover": { filter: "brightness(1.05)" },
                  }),
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(0,0,0,0.0)" },
                "50%": {
                  boxShadow:
                    "0 0 0 12px rgba(124, 58, 237, 0.15), 0 0 0 0 rgba(0,0,0,0.0)",
                },
                "100%": { boxShadow: "0 0 0 0 rgba(0,0,0,0.0)" },
              },
            })}
          >
            {done ? "It’s time!" : buttonText}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

// ------- subcomponents -------
function TimeBlock({ label, value, accent }) {
  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        minWidth: { xs: 76, sm: 86, md: 96 },
        px: { xs: 1.25, sm: 1.75 },
        py: { xs: 1, sm: 1.25 },
        borderRadius: 3,
        display: "grid",
        placeItems: "center",
        borderColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.14)"
            : "rgba(0,0,0,0.12)",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))"
            : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
      })}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          lineHeight: 1.05,
          fontVariantNumeric: "tabular-nums lining-nums",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={(theme) => ({
          letterSpacing: 1,
          textTransform: "uppercase",
          mt: 0.5,
          color:
            accent ??
            (theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.8)"
              : "rgba(0,0,0,0.6)"),
          fontWeight: 700,
        })}
      >
        {label}
      </Typography>
    </Paper>
  );
}

function TimeSep() {
  return (
    <Typography
      component="span"
      aria-hidden="true"
      sx={{
        alignSelf: "center",
        px: { xs: 0.25, sm: 0.5 },
        opacity: 0.4,
        fontSize: { xs: 28, sm: 34, md: 38 },
        fontWeight: 700,
        lineHeight: 1,
        userSelect: "none",
      }}
    >
      :
    </Typography>
  );
}
