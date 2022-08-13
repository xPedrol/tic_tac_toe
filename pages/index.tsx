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

const Home: NextPage = () => {
    const borderColor = useColorModeValue('gray.300', 'gray.700');
    const [LOADED, setLoaded] = useState(false);
    const [grid, setGrid] = useState<string[][]>([]);
    const [player, setPlayer] = useState<string>('X');
    const [winnerState, setWinnerState] = useState<boolean | undefined>(false);
    const [xPoints, setXPoints] = useState<number>(0);
    const [oPoints, setOPoints] = useState<number>(0);
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
    const handleClick = (i: number, j: number) => {
        if (!winnerState) {
            const gridAux = [...grid];
            if (gridAux[i][j] === " ") {
                gridAux[i][j] = player;
                setGrid(gridAux);
                setPlayer(player === 'X' ? 'O' : 'X');
                setGrid(gridAux);
                const winner = verifyWinner();
                if (winner) {
                    if (winner !== 'V') {
                        if (winner === 'X') {
                            setXPoints(xPoints + 1);
                        } else {
                            setOPoints(oPoints + 1);
                        }
                        console.log(`Vencedor: ${winner}`);
                        setWinnerState(true);
                    } else {
                        setWinnerState(undefined);
                    }
                }
            }
        }
        console.warn(i, j);
    };
    const handleReset = (fullReset = true): void => {
        drawGrid();
        setPlayer('X');
        setWinnerState(false);
        if (fullReset) {
            setXPoints(0);
            setOPoints(0);
        }
    };
    const verifyWinner = () => {
        let hasEmpty = false;
        const match = (combination: string) => {
            if (combination === 'XXX' || combination === 'OOO') {
                console.warn(combination === 'OOO');
                return combination[0];
            }
        };
        const gridAux = [...grid];
        let combinationD = '';
        let combinationInvD = '';
        for (let i = 0; i < 3; i++) {
            let combinationX = '';
            let combinationY = '';
            for (let j = 0; j < 3; j++) {
                combinationY += gridAux[i][j];
                combinationX += gridAux[j][i];
                if (gridAux[i][j] === ' ') {
                    hasEmpty = true;
                }
            }
            combinationD += gridAux[i][i];
            combinationInvD += gridAux[i][2 - i];
            let winner = match(combinationY);
            if (winner) return winner;
            winner = match(combinationX);
            if (winner) return winner;
            winner = match(combinationD);
            if (winner) return winner;
            winner = match(combinationInvD);
            if (winner) return winner;
        }
        if (!hasEmpty) return 'V';
        return null;
    };
    return (
        <>
            {LOADED && winnerState &&
                <Confetti
                    recycle={false}
                    width={width}
                    height={height}
                />
            }
            <Layout title={'Tic Tac Toe'}>
                <Flex justifyContent={'center'} alignItems={'center'} height={'100vh'} flexDirection={'column'}>
                    <Grid templateColumns={'repeat(12,1fr)'} width={'100%'} alignItems={'center'}>
                        <GridItem colSpan={{base: 12, md: 8}} textAlign={{base: 'center', md: 'left'}}>
                            <Heading
                                size={'4xl'}
                                as={'span'}
                                position={'relative'}
                                _after={{
                                    content: "''",
                                    width: 'full',
                                    height: '30%',
                                    position: 'absolute',
                                    bottom: 1,
                                    left: 0,
                                    bg: 'teal',
                                    zIndex: -1,
                                }}>
                                Tic Tac Toe
                            </Heading>
                        </GridItem>
                        <GridItem colSpan={{base: 12, md: 4}} textAlign={{base: 'center', md: 'end'}}
                                  mt={{base: 5, md: 0}}>
                            <Box>
                                <Heading size={'md'}>X: <Text as={'span'} color={'teal'}>{xPoints} pts</Text></Heading>
                                <Heading size={'md'}>O: <Text as={'span'} color={'teal'}>{oPoints} pts</Text></Heading>
                            </Box>
                        </GridItem>
                    </Grid>
                    <Divider my={5}/>
                    {winnerState && <WinnerSection player={player} handleReset={handleReset}/>}
                    {winnerState === undefined && <DrawSection handleReset={handleReset}/>}
                    <Grid templateColumns={'repeat(3, 1fr)'} templateRows={'repeat(3, 1fr)'} mt={5}>
                        {grid.map((row, i) => row.map((col, j) =>
                            <GridItem key={`${i}${j}`} borderTop={i == 1 || i == 2 ? '8px solid' : 'none'}
                                      cursor={grid[i][j] === ' ' ? 'pointer' : 'default'}
                                      borderLeft={j == 1 || j == 2 ? '8px solid' : 'none'} borderColor={borderColor}
                                      onClick={() => handleClick(i, j)}
                                      width={{base:'7rem',sm:'8rem',md:'10rem'}} height={{base:'7rem',sm:'8rem',md:'10rem'}}>
                                <Flex alignItems={'center'} justifyContent={'center'} height={'100%'}>
                                    <Heading size={'4xl'}>
                                        {grid[i][j]}
                                    </Heading>
                                </Flex>
                            </GridItem>
                        ))}
                    </Grid>
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
    handleReset: (fullReset?:boolean) => void;
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
                onClick={()=>handleReset(false)}>
                Try again
            </Button>
        </VStack>
    );
};
export default Home;
