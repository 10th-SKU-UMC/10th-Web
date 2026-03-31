import { useTheme, THEME } from './context/ThemeProvider';
import clsx from 'clsx';

export default function ThemeContent() {
    const { theme } = useTheme();
    const isLightMode = theme === THEME.LIGHT;

    return (
        <div className={clsx(
            'flex flex-col items-center justify-center flex-1 w-full p-8 transition-all',
            isLightMode ? 'bg-white' : 'bg-gray-800'
        )}>
            <h1 className='text-3xl font-bold mb-4'>
                {isLightMode ? '라이트 모드' : '다크 모드'}
            </h1>
            <p className='text-lg'>현재 테마: {theme}</p>
        </div>
    );
}