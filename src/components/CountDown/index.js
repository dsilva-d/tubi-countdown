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
export default function CountDown({
  target = new Date("2025-11-07T00:00:00"),
  title = "Countdown for Growing Pains Getting Added To Tubi",
  buttonText = "It's Time! Take Me to the Tubi Movie!",
  onButtonClick,
  accent,
  formatAbove = "md",
}) {
  const { msLeft, days, hours, minutes, seconds } = useCountdown(target);
  const done = msLeft === 0;

  const theme = useTheme();
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
        })}
      >
        <Stack spacing={3} alignItems="center">
          {/* Growing Pains image */}
          <Box
            component="img"
            src="/img/growingpains.jpg"
            alt="Growing Pains"
            sx={{
              width: "30%",
              maxWidth: 640,
              borderRadius: 3,
              objectFit: "cover",
            }}
          />

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
            sx={{ fontWeight: 800, lineHeight: 1.15 }}
          >
            {title}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.7, mt: -1 }}>
            Growing Pains Tubi Movie Release Date: {fmtLongDate(target)}
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
            sx={{ mt: 1, fontWeight: 700, borderRadius: 2 }}
          >
            {done ? "It’s time!" : buttonText}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

// ------- layouts (unchanged from your version) -------
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
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
      }}
    >
      <Typography component="span" sx={{ fontWeight: 800, fontSize: 28 }}>
        {days}:{hours}:{minutes}:{seconds}
      </Typography>
      <Typography component="span" variant="caption" sx={{ ml: 0.5, opacity: 0.7 }}>
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
      sx={{ minWidth: 76, px: 1.25, py: 1, borderRadius: 3, display: "grid", placeItems: "center" }}
    >
      <Typography variant="h3" sx={{ fontWeight: 800 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 700 }}>
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
      sx={{ alignSelf: "center", px: 0.5, opacity: 0.4, fontSize: 34, fontWeight: 700 }}
    >
      :
    </Typography>
  );
}