use borsh::{BorshDeserialize, BorshSerialize};
use rand::{Rng, SeedableRng};
use rand::rngs::SmallRng;
use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct RandomNumber {
    pub number: u32,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let random_number_account = next_account_info(account_info_iter)?;

    let mut rng = SmallRng::from_entropy();
    let random_number = rng.gen_range(1..101);

    let random_number_struct = RandomNumber {
        number: random_number,
    };

    random_number_struct.serialize(&mut &mut random_number_account.data.borrow_mut()[..])?;

    msg!("Random number generated: {}", random_number);

    Ok(())
}