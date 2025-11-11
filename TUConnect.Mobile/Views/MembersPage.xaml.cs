using TUConnect.Mobile.ViewModels;

namespace TUConnect.Mobile.Views;

public partial class MembersPage : ContentPage
{
    public MembersPage(MemberViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is MemberViewModel vm)
        {
            vm.LoadMembersCommand.Execute(null);
        }
    }
}
