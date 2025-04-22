import { AppBar, Box, Container, CssBaseline, Tab, Tabs, Toolbar, Typography } from "@mui/material"
import { createContext, useState } from "react";

import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import QuizIcon from '@mui/icons-material/Quiz';
import SailingIcon from '@mui/icons-material/Sailing';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import QuestionsPage from "./QuestionsPage/QuestionsPage";
import QuizesPage from "./QuizesPage/QuizesPage";
import QuizPage from "./QuizPage/QuizPage";
import { QuestionForUI } from "../../cold-harbor-service/src";

interface QuizContextType {
  currentQuizId: number | null
  setCurrentQuizId: (a: number | null) => void
  navigateToTab: (id: number) => void
  selectedQuestions: QuestionForUI[]
  setSelectedQuestions: (e: any) => void
}

export const QuizContext = createContext<QuizContextType>({
  currentQuizId: null,
  setCurrentQuizId: () => void (0),
  navigateToTab: () => void (0),
  selectedQuestions: [],
  setSelectedQuestions: () => void (0)
})

function App() {
  const [page, setPage] = useState(0)
  const [currentQuizId, setCurrentQuizId] = useState<number | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionForUI[]>([])

  return (
    <QuizContext.Provider value={{ currentQuizId, setCurrentQuizId, navigateToTab: setPage, selectedQuestions, setSelectedQuestions }}>
      <Box height={"100vh"} width={"100vw"} sx={{ backgroundColor: "#F2F4FF" }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar>
              <SailingIcon />
              <Typography variant="h5" sx={{ ml: 2 }}>Cold Harbor</Typography>
            </Toolbar>
          </Container>
        </AppBar>
        <Box paddingTop={8} height={"100%"} width={"100%"} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Container maxWidth="xl">
            <Tabs value={page} onChange={(_, p) => setPage(p)} centered>
              <Tab label="Questions" iconPosition="start" icon={<QuestionMarkIcon />} />
              <Tab label="Quizes" iconPosition="start" icon={<QuizIcon />} />
              <Tab label="Current Quiz" iconPosition="start" icon={<PlayCircleFilledIcon />} disabled={currentQuizId === null} />
            </Tabs>
            {
              page === 0 ? <QuestionsPage /> : null
            }
            {
              page === 1 ? <QuizesPage /> : null
            }
            {
              page === 2 ? <QuizPage /> : null
            }
          </Container>
        </Box>
      </Box>
    </QuizContext.Provider>
  )
}

export default App
