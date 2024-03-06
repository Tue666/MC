import { useEffect } from 'react';
import { StackActions } from '@react-navigation/native';
import { Loading } from '../../../components';
import { useSocketClient } from '../../../hooks';
import { useAppSelector } from '../../../redux/hooks';
import { selectAccount } from '../../../redux/slices/account.slice';
import { ConquerLoadingQuestionProps, IQuestion } from '../../../types';
import { openDialog } from '../../../utils';

const LoadingQuestion = (props: ConquerLoadingQuestionProps) => {
	const { navigation, route } = props;
	const { resource, room, roomMode } = route.params;
	const popAction = StackActions.pop(2);
	const { profile } = useAppSelector(selectAccount);
	const socketClient = useSocketClient();

	useEffect(() => {
		const isOwner = room.owner === profile._id;
		if (isOwner) {
			requestQuestions();
		}
	}, []);
	const requestQuestions = () => {
		const questionQueryParams = {};

		socketClient?.emit('conquer[quick-match]:client-server(loading-question)', {
			mode: roomMode,
			resource: resource._id,
			room,
			questionQueryParams,
		});
	};
	useEffect(() => {
		socketClient?.on(
			'conquer[quick-match]:server-client(loading-question)',
			(questions: IQuestion.Question[]) => {
				if (!questions.length) {
					navigation.dispatch(popAction);
					openDialog({
						title: '[Tìm câu hỏi] Không tìm thấy',
						content: 'Hiện tại không có câu hỏi phù hợp nào, quay lại sau bạn nhé!',
					});
					return;
				}

				const question = questions[0];
				navigation.navigate('QuickMatch', { resource, room, roomMode, question });
			}
		);

		socketClient?.on('[ERROR]conquer[quick-match]:server-client(loading-question)', (error) => {
			openDialog({
				title: '[Tìm câu hỏi] Lỗi',
				content: error,
			});
		});

		socketClient?.on('conquer:server-client(transfer-owner-loading)', () => {
			requestQuestions();
		});
	}, []);
	return <Loading />;
};

export default LoadingQuestion;
