import { View, Text, ScrollView, Touchable } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../App'
import useNativeAxiosPrivate from '../../../hooks/useNativeAxiosPrivate'
import { StudentAssignmentUI } from 'types'
import { ColorModeContext } from '../../../library/AppearanceContext'
import { Icon } from '@rneui/base'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = NativeStackScreenProps<RootStackParamList, "StudentAssignmentView">

const StudentAssignmentView = ({ navigation, route }: Props) => {
    const [assignment, setAssignment] = useState<StudentAssignmentUI | null>(null);
    const color = useContext(ColorModeContext);
    const axios = useNativeAxiosPrivate();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.ASSIGNMENT_ID.toString(),
            headerShown: true,
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: color.lightDark,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
                color: color.textPrimary
            }
        })
    }, [navigation])



    useEffect(() => {
        axios.get('students/assignments/' + route.params.ASSIGNMENT_ID)
            .then(res => {
                setAssignment(res.data);
            })
    }, [])

    if (!assignment) {
        return <View>
            <Text>Loading...</Text>
        </View>
    }

    return (
        <ScrollView>
            <Text style={{ fontSize: 20 }}>{assignment?.ASSIGNMENT_NAME}</Text>

            <View style={{ height: 100, backgroundColor: color.light, overflow: 'scroll' }}>
                <ScrollView horizontal>
                    {assignment.ASSIGNMENT_FILES.map(file => (
                        <TouchableOpacity key={file.FILE_ID} style={{ height: '100%', width: 120, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="description" size={35} color={color.primary}/>
                            <Text numberOfLines={1} style={{ color: color.textPrimary, fontSize: 20 }} key={file.FILE_ID}>{file.FILE_NAME}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={{ height: 100, backgroundColor: color.light, overflow: 'scroll' }}>
                <ScrollView horizontal>
                    {assignment.WORK_FILES.map(file => (
                        <TouchableOpacity key={file.FILE_URL} style={{ height: '100%', width: 120, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="description" size={35} color={color.primary}/>
                            <Text numberOfLines={1} style={{ color: color.textPrimary, fontSize: 20 }}>{file.FILE_NAME}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

        </ScrollView>
    )
}

export default StudentAssignmentView