import * as React from "react";
import {
  Box,
  Stack,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  useMediaQuery,
  useTheme,
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

// ------- main -------
/**
 * formatAbove:
 *  - MUI breakpoint key: 'sm' | 'md' | 'lg' | 'xl'
 *  - OR a pixel number (e.g. 900) to switch at that width
 */
export default function CountDown({
  target = new Date("2025-11-07T00:00:00"),
  title = "Countdown for Growing Pains Getting Added To Tubi",
  buttonText = "It's Time! Take Me to the Tubi Movie!",
  onButtonClick,
  accent,
  formatAbove = "md", // use "full" layout at/above this breakpoint (or px)
}) {
  const { msLeft, days, hours, minutes, seconds } = useCountdown(target);
  const done = msLeft === 0;

  const theme = useTheme();

  // Build a stable string media query first, then one useMediaQuery call
  const mq = React.useMemo(
    () =>
      typeof formatAbove === "number"
        ? `(min-width:${formatAbove}px)`
        : theme.breakpoints.up(formatAbove),
    [formatAbove, theme]
  );
  const isFull = useMediaQuery(mq, { noSsr: true });

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
      if (!done) {
        alert(
          `Easy, it's not added to Tubi yet. It's supposed to be added Friday, November 7th, 2025 and today is ${today}. Come on, why even press the button. Seriously, I want to know. What did you expect. Tell me. You thought I was just gonna make the movie? Like generate my own Growing Pains movie? Jesus, you're slow. Just wait. Learn to have some patients. Go on Subway Surfers or whatever you do with you wasteful freetime. Come back when it's actually Tuesday, November 7th, 2025, prick.`
        );
      }
    });

  const accentBg = (t) => accent ?? t.palette.primary.main;

  return (
    <Box
      sx={(t) => ({
        fontFamily: `"Noto Sans", ${t.typography.fontFamily}`,
        display: "grid",
        placeItems: "center",
        px: { xs: 2, md: 4 },
        py: { xs: 4, md: 8 },
        textAlign: "center",
        background: `linear-gradient(135deg,
          ${t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"},
          transparent 35%),
          radial-gradient(80% 120% at 50% -10%,
          ${t.palette.mode === "dark" ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.06)"},
          transparent 60%)`,
      })}
    >
      <Paper
        elevation={0}
        sx={(t) => ({
          width: "100%",
          maxWidth: 860,
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          borderRadius: 4,
          backdropFilter: "saturate(120%) blur(6px)",
          backgroundColor:
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(255,255,255,0.8)",
          border: `1px solid ${
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.07)"
          }`,
        })}
      >
        <Stack spacing={3} alignItems="center">
          <Chip
            label={done ? "Available" : "Upcoming"}
            size="small"
            sx={(t) => ({
              bgcolor: `${accentBg(t)}1A`,
              color: accent ? "#111" : t.palette.primary.main,
              borderRadius: 2,
            })}
          />
          <Typography
            variant={isFull ? "h4" : "h5"}
            sx={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: 0.2 }}
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

          {isFull ? (
            <FullCounter
              days={days}
              hours={pad(hours)}
              minutes={pad(minutes)}
              seconds={pad(seconds)}
              accent={accent}
            />
          ) : (
            <CompactCounter
              days={days}
              hours={pad(hours)}
              minutes={pad(minutes)}
              seconds={pad(seconds)}
            />
          )}

          <Button
            variant={done ? "outlined" : "contained"}
            size={isFull ? "large" : "medium"}
            onClick={handleClick}
            sx={(t) => ({
              mt: 1,
              px: isFull ? 3 : 2.25,
              fontWeight: 700,
              borderRadius: 2,
              ...(done
                ? {
                    borderColor: accentBg(t),
                    color: accent ? accentBg(t) : t.palette.primary.main,
                    animation: "pulse 1.2s ease-in-out 2",
                  }
                : {
                    backgroundColor: accentBg(t),
                    "&:hover": { filter: "brightness(1.05)" },
                  }),
              "@keyframes pulse": {
                "0%": { boxShadow: "0 0 0 0 rgba(0,0,0,0.0)" },
                "50%": {
                  boxShadow:
                    "0 0 0 12px rgba(124,58,237,0.15), 0 0 0 0 rgba(0,0,0,0.0)",
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

// ------- layouts -------
function FullCounter({ days, hours, minutes, seconds, accent }) {
  return (
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
      <TimeBlock label="Hours" value={hours} />
      <TimeSep />
      <TimeBlock label="Minutes" value={minutes} />
      <TimeSep />
      <TimeBlock label="Seconds" value={seconds} />
    </Box>
  );
}

function CompactCounter({ days, hours, minutes, seconds }) {
  return (
    <Paper
      role="timer"
      aria-live="polite"
      variant="outlined"
      sx={(t) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
        fontVariantNumeric: "tabular-nums lining-nums",
        borderColor:
          t.palette.mode === "dark"
            ? "rgba(255,255,255,0.18)"
            : "rgba(0,0,0,0.14)",
        background:
          t.palette.mode === "dark"
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.85)",
      })}
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 800,
          letterSpacing: 0.5,
          fontSize: 28,
          lineHeight: 1,
        }}
      >
        {days}:{hours}:{minutes}:{seconds}
      </Typography>
      <Typography
        component="span"
        variant="caption"
        sx={{ ml: 0.5, opacity: 0.7 }}
      >
        Days:Hours:Min:Sec
      </Typography>
    </Paper>
  );
}

// ------- atoms -------
function TimeBlock({ label, value, accent }) {
  return (
    <Paper
      variant="outlined"
      sx={(t) => ({
        minWidth: { xs: 76, sm: 86, md: 96 },
        px: { xs: 1.25, sm: 1.75 },
        py: { xs: 1, sm: 1.25 },
        borderRadius: 3,
        display: "grid",
        placeItems: "center",
        borderColor:
          t.palette.mode === "dark"
            ? "rgba(255,255,255,0.14)"
            : "rgba(0,0,0,0.12)",
        background:
          t.palette.mode === "dark"
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
        sx={(t) => ({
          letterSpacing: 1,
          textTransform: "uppercase",
          mt: 0.5,
          color:
            accent ??
            (t.palette.mode === "dark"
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
