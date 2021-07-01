import { Context } from '@vue-storefront/core'
// import { CustomerUserAuthInfo_Input, CustomerAuthTicket } from '../../types/GraphQL'
import mutation from './defaultMutation'


//const loginUser = async (context:Context, params: CustomerUserAuthInfo_Input ): Promise<any> => {
const loginUser = async (context:Context, params: any ): Promise<any> => {

    const variables = {
        loginInput: params
    };
    //CustomerAuthTicket
    const loginResponse = await context.client.mutate({
        mutation,
        variables,
        fetchPolicy: 'no-cache'
    }) as any;
    
    return loginResponse
}

export default loginUser