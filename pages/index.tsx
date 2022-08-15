import type {NextPage} from 'next';
import Layout from "../components/Layout";
import {
    Box,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Stack,
    Text,
    useColorModeValue,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import {RepeatClockIcon} from "@chakra-ui/icons";
import styles from "../styles/Home.module.css";
const Home: NextPage = () => {
    const borderColor = useColorModeValue('gray.300', 'gray.700');
    const backGroundColor = useColorModeValue('black', 'white');
    const scoreFontSize = {base:'large',md:'xx-large'};
    const playersFontSize = {base:'xxx-small',md:'sm'};
    const [LOADED, setLoaded] = useState(false);
    const [grid, setGrid] = useState<string[][]>([]);
    const [player, setPlayer] = useState<string>('X');
    const [winnerState, setWinnerState] = useState<number[][]>([]);
    const [xPoints, setXPoints] = useState<number>(0);
    const [oPoints, setOPoints] = useState<number>(0);
    const [drawPoints, setDrawPoints] = useState<number>(0);
    const {width, height} = useWindowSize();
    useEffect(() => {
        setLoaded(true);
        drawGrid();
    }, []);
    const drawGrid = () => {
        const gridAux: string[][] = [];
        for (let i = 0; i < 3; i++) {
            gridAux[i] = [];
            for (let j = 0; j < 3; j++) {
                gridAux[i][j] = " ";
            }
        }
        setGrid(gridAux);
    };
    const handleBorderColor = (i: number, j: number) => {
        // if (winnerState.length > 0) {
        //     for (let k = 0; k < winnerState.length; k++) {
        //         if (winnerState[k][0] === i && winnerState[k][1] === j) {
        //             return 'teal';
        //         }
        //         if (winnerState[k][0] === i && winnerState[k][1] === j) {
        //             return 'teal';
        //         }
        //     }
        // }
        return borderColor;
    }
    const handleClick = (i: number, j: number) => {
        if (winnerState.length === 0) {
            const gridAux = [...grid];
            if (gridAux[i][j] === " ") {
                gridAux[i][j] = player;
                setGrid(gridAux);
                setPlayer(player === 'X' ? 'O' : 'X');
                setGrid(gridAux);
                const winner = verifyWinner();
                if (winner.length > 0) {
                    if (winner.some(e => e.some(e1 => e1 !== -1))) {
                        if (gridAux[winner[0][0]][winner[0][1]] === 'X') {
                            setXPoints(xPoints + 1);
                        } else {
                            setOPoints(oPoints + 1);
                        }
                        console.log(`Vencedor: ${gridAux[winner[0][0]][winner[0][1]]}`);

                    }else{
                        setDrawPoints(drawPoints + 1);
                    }
                    setWinnerState(winner);
                }
            }
        }
    };
    const handleReset = (fullReset = true): void => {
        drawGrid();
        setPlayer('X');
        setWinnerState([]);
        if (fullReset) {
            setXPoints(0);
            setOPoints(0);
        }
    };
    const verifyWinner = () => {
        let hasEmpty = false;
        const match = (combination: string) => {
            if (combination === 'XXX' || combination === 'OOO') {
                return combination[0];
            }
        };
        const gridAux = [...grid];
        let combinationD = '';
        let combinationInvD = '';
        for (let i = 0; i < 3; i++) {
            let combinationY = '';
            let combinationX = '';
            for (let j = 0; j < 3; j++) {
                combinationX += gridAux[i][j];
                combinationY += gridAux[j][i];
                if (gridAux[i][j] === ' ') {
                    hasEmpty = true;
                }
            }
            combinationD += gridAux[i][i];
            combinationInvD += gridAux[i][2 - i];
            let winner = match(combinationX);
            if (winner) {
                return [[i, 0], [i, 1], [i, 2]];
            }
            winner = match(combinationY);
            if (winner) {
                return [[0, i], [1, i], [2, i]];
            }
            winner = match(combinationD);
            if (winner) {
                return [[0, 0], [1, 1], [2, 2]];
            }
            winner = match(combinationInvD);
            if (winner) {
                return [[0, 2], [1, 1], [2, 0]];
            }
        }
        if (!hasEmpty) return [[-1, -1], [-1, -1], [-1, -1]];
        return [];
    };
    return (
        <>
            {LOADED && winnerState.length > 0 && winnerState.some(e => e.some(e1 => e1 !== -1)) &&
                <Confetti
                    recycle={false}
                    width={width}
                    height={height}
                />
            }
            <Layout title={'Tic Tac Toe'}>
                <Flex justifyContent={'center'} alignItems={'center'} height={'100vh'} flexDirection={'column'}>
                    {/*<Divider my={5}/>*/}
                    {winnerState.length > 0 && winnerState.some(e => e.some(e1 => e1 !== -1)) && <WinnerSection player={player} handleReset={handleReset}/>}
                    {winnerState.length > 0 && !winnerState.some(e => e.some(e1 => e1 !== -1)) && <DrawSection handleReset={handleReset}/>}
                    <Grid templateColumns={'repeat(3, 1fr)'} templateRows={'repeat(3, 1fr)'} mt={5}>
                        {grid.map((row, i) => row.map((col, j) =>
                            <GridItem key={`${i}${j}`} borderTop={i == 1 || i == 2 ? '8px solid' : 'none'}
                                      cursor={grid[i][j] === ' ' ? 'pointer' : 'default'}
                                      borderLeft={j == 1 || j == 2 ? '8px solid' : 'none'} borderColor={handleBorderColor(i, j)}
                                      onClick={() => handleClick(i, j)}
                                      width={{base: '7rem', sm: '8rem',md:'10rem', xl: '13rem'}}
                                      height={{base: '7rem', sm: '8rem',md:'10rem', xl: '13rem'}}>
                                <Flex alignItems={'center'} justifyContent={'center'} height={'100%'}>
                                    <Heading size={'4xl'}>
                                        {/*{grid[i][j]}*/}
                                        {grid[i][j] === 'X' && <Box
                                            width={{base:'4rem',sm:'5rem',md:'7rem',xl:'10rem'}}
                                            height={{base:'4rem',sm:'5rem',md:'7rem',xl:'10rem'}}
                                            _after={{backgroundColor:backGroundColor}}
                                            _before={{backgroundColor:backGroundColor}}
                                            className={styles.drawX}></Box>}
                                        {grid[i][j] === 'O' && <Box
                                            width={{base:'3rem',sm:'4rem',md:'6rem',xl:'8rem'}}
                                            height={{base:'3rem',sm:'4rem',md:'6rem',xl:'8rem'}}
                                            borderColor={backGroundColor}
                                            className={styles.drawO}></Box>}
                                    </Heading>
                                </Flex>
                            </GridItem>
                        ))}
                    </Grid>
                    <GridItem colSpan={{base: 12, md: 12}} textAlign={{base: 'center', md: 'end'}}
                              mt={{base: 5, md: 10}}>
                        <Box display={'flex'} textAlign={'center'} justifyContent={'center'} gap={{base:10,md:20}}>
                            <Text size={playersFontSize}>Jogador (X) <br/><Text fontWeight={'bold'} fontSize={scoreFontSize} as={'span'} color={'teal'}>{xPoints}</Text></Text>
                            <Text size={playersFontSize}> - <br/><Text as={'span'} fontWeight={'bold'} fontSize={scoreFontSize} color={'teal'}>{drawPoints}</Text></Text>
                            <Text size={playersFontSize}>Jogador (O) <br/><Text fontWeight={'bold'} fontSize={scoreFontSize} as={'span'} color={'teal'}>{oPoints}</Text></Text>
                        </Box>
                    </GridItem>
                </Flex>
            </Layout>
        </>
    );
};
type WinnerSectionProps = {
    player: string;
    handleReset: (fullReset?: boolean) => void;
}
const WinnerSection = ({player, handleReset}: WinnerSectionProps) => {
    return (
        <VStack>
            <Heading size={'lg'} color={'gray.500'}>Player <Text as={'span'}
                                                                 color={'teal'}> {player === 'X' ? 'O' : 'X'}</Text> won
                this round!</Heading>
            <Stack direction={['column', 'row']}>
                <Button
                    variant={'solid'}
                    colorScheme={'teal'}
                    size={'lg'}
                    leftIcon={<RepeatClockIcon/>}
                    onClick={() => handleReset(true)}>
                    Reset
                </Button>
                <Button
                    variant={'solid'}
                    colorScheme={'teal'}
                    size={'lg'}
                    onClick={() => handleReset(false)}>
                    Try again
                </Button>
            </Stack>
        </VStack>
    );
};
type ATieSectionProps = {
    handleReset: (fullReset?: boolean) => void;
}
const DrawSection = ({handleReset}: ATieSectionProps) => {
    return (
        <VStack>
            <Heading>Draw!</Heading>
            <Button
                variant={'solid'}
                colorScheme={'teal'}
                size={'lg'}
                leftIcon={<RepeatClockIcon/>}
                onClick={() => handleReset(false)}>
                Try again
            </Button>
        </VStack>
    );
};
export default Home;
