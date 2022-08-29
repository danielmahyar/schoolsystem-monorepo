import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Icon } from '@rneui/base'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../App'
import { AssignmentStatus, StudentAssignmentUI } from 'types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ColorModeContext } from '../library/AppearanceContext'

const AssignmentListItem = ({ ASSIGNMENT_NAME, ASSIGNMENT_ID, SUBJECT, STATUS, GRADE_TYPE, GRADE }: StudentAssignmentUI) => {
  const color = useContext(ColorModeContext);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TouchableOpacity onPress={() => nav.navigate("StudentAssignmentView", { ASSIGNMENT_ID })}
      style={{ width: '100%', alignItems: 'center', height: 100, paddingHorizontal: 20, display: 'flex', flex: 1, flexDirection: 'row' }}
      
    >
      <Icon style={{ marginRight: 10 }} name={STATUS === AssignmentStatus.GRADED || STATUS === AssignmentStatus.SUBMITTED ? "check-circle" : STATUS === AssignmentStatus.SUBMITTED_TOO_LATE ? "assignment-late" : "cancel"} size={50} color={color.primary} />
      
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', height: '100%' }}>
        <Text style={{ fontSize: 16, color: color.textPrimary, fontWeight: 'bold'}}>{ASSIGNMENT_NAME}</Text>
        <Text style={{ fontSize: 13, color: color.textSecondary }}>Subject: {SUBJECT}</Text>
        {STATUS === AssignmentStatus.GRADED && <Text style={{ fontSize: 13, color: color.textSecondary }}>Grade: {GRADE}</Text>}
        {STATUS && !GRADE && <Text style={{ fontSize: 13, color: color.textSecondary }}>Status: {STATUS}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default AssignmentListItem