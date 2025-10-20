import LoginPage from "./login";


export default function HomeScreen() {
    // const { data, isLoading, error } = useQuery({
    //     queryKey: ['users'],
    //     queryFn: () =>getUsers(),
    // });

    // if (isLoading) {
    //     return <ActivityIndicator style={{ marginTop: '20%' }} />;
    // };

    // if (error) {
    //     return <Text style={{ marginTop: '20%' }}> {error.message}</Text>;
    // };

    // const user = data[0];

    

    return (
        <LoginPage></LoginPage>
  );
}