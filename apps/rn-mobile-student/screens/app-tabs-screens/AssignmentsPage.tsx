import { View, FlatList, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from '../../library/AuthContext';
import AssignmentListItem from '../../components/AssignmentListItem';
import { Chip, SearchBar, Skeleton } from '@rneui/base';
import { StudentAssignmentUI } from 'types';
import useNativeAxiosPrivate from '../../hooks/useNativeAxiosPrivate';
import { ColorModeContext } from '../../library/AppearanceContext';
import _ from 'underscore'


const filterOptionsInitial = [
    {
        label: 'All',
        id: 'All',
        active: true
    },
    {
        label: 'Danish',
        id: 'Danish',
        active: false
    },
    {
        label: 'English',
        id: 'English',
        active: false
    }
]


const AssignmentsPage = () => {
    const axios = useNativeAxiosPrivate();
    const color = useContext(ColorModeContext);
    const [filterOptions, setFilterOptions] = useState(filterOptionsInitial);
    const [assignments, setAssignments] = useState<StudentAssignmentUI[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefresh] = useState(false);

    const retrieveAssignments = async (queries: string) => {
        try {
            const response = await axios.get('students/assignments?' + queries);
            setAssignments(response.data);
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        setLoadingScreen(true);
        const queries = encodeURIComponent(JSON.stringify(filterOptions.filter(o => o.active).map(o => o.id)))
        const allQueries = `type=${queries}&search=${encodeURIComponent(searchText)}`;
        retrieveAssignments(allQueries).then(() => setLoadingScreen(false)).catch(() => setLoadingScreen(false));
    }, [filterOptions])


    const handleActiavateFilter = useCallback((id: string) => {
        if (id === 'All') {
            setFilterOptions(filterOptionsInitial)
        } else {
            setFilterOptions(prev => prev.map(filter => {
                if (filter.id === 'All') return { ...filter, active: false }
                if (filter.id === id) return { ...filter, active: !filter.active }
                return filter;
            }))
        }
    }, [])

    const handleRefresh = async () => {
        setRefresh(true);
        const queries = encodeURIComponent(JSON.stringify(filterOptions.filter(o => o.active).map(o => o.id)))
        const allQueries = `type=${queries}&search=${encodeURIComponent(searchText)}`;
        console.log("test")
        await retrieveAssignments(allQueries);
        setRefresh(false);
    }

    const handleSearchBarChange = async () => {
        setLoading(true)
        const queries = encodeURIComponent(JSON.stringify(filterOptions.filter(o => o.active).map(o => o.id)))
        const allQueries = `type=${queries}&search=${encodeURIComponent(searchText)}`;
        await retrieveAssignments(allQueries);
        setLoading(false);
    }

    const handleSearchBarClear = async () => {
        setLoading(true);
        setSearchText('');
        const queries = encodeURIComponent(JSON.stringify(filterOptions.filter(o => o.active).map(o => o.id)))
        const allQueries = `type=${queries}&search=${encodeURIComponent('')}`;
        await retrieveAssignments(allQueries);
        setLoading(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <SearchBar
                    placeholder="Search"
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearchBarChange}
                    value={searchText}
                    onClear={handleSearchBarClear}
                    style={{ backgroundColor: color.dark, borderBottomWidth: 0 }}
                    containerStyle={{ backgroundColor: color.lightDark, borderWidth: 0, borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
                    inputContainerStyle={{ backgroundColor: color.dark, paddingHorizontal: 10 }}
                    rightIcon
                    showLoading={loading}
                />
                <ScrollView
                    horizontal
                    style={{ width: '100%', backgroundColor: color.lightDark, paddingBottom: 10 }}
                    contentContainerStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 10 }}
                >
                    {filterOptions.map(option => (
                        <Chip title={option.label} key={option.id} onPress={() => handleActiavateFilter(option.id)} style={{ marginRight: 5 }} color={option.active ? color.primary : color.light} />
                    ))}
                </ScrollView>
            </View>
            <View style={{ flex: 1 }}>

                {loadingScreen ? (
                    <View style={{ flex: 1, display: 'flex', justifyContent: 'space-around', width: '85%' }}>
                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>

                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>

                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>

                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>

                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>

                        <View style={{ paddingHorizontal: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Skeleton height={40} circle width={40} animation="wave" style={{ backgroundColor: color.dark, marginRight: 5 }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                            <Skeleton height={40} animation="wave" style={{ backgroundColor: color.dark }} skeletonStyle={{ backgroundColor: color.lightDark }} />
                        </View>
                    </View>
                ) : (
                    <FlatList
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        data={assignments}
                        keyExtractor={item => item.ASSIGNMENT_ID.toString()}
                        renderItem={({ item }) => <AssignmentListItem {...item} />}
                    />
                )}
            </View>
        </View>
    )
}

export default AssignmentsPage